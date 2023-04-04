from celery import shared_task
from .models import send_update_file_data
from concurrent.futures import ThreadPoolExecutor

import subprocess
import math
import json
import cv2
import subprocess
import os



@shared_task
def video_encode_task(filedata_id):
    from core.models import Categories, FileData
    instance = FileData.objects.get(id=filedata_id)
    # fileDataに追加されたcategoryがCategoriesに存在しない場合、Categoriesに追加
    categories_objects = Categories.objects.all()
    file_data_categories = json.loads(instance.categories)
    all_categories = []

    for category_object in categories_objects:
        all_categories.append(category_object.category)

    for file_data_category in file_data_categories:
        if not file_data_category in all_categories:
            Categories.objects.create(category=file_data_category, user=instance.user)

    # 保存されたvideoData, cover_imageのパス, main_data名, export_path
    main_data_path = "media/"+str(instance.main_data)
    cover_image_path = "media/"+str(instance.cover_image)
    main_data_name = str(main_data_path).split("/")[-1]
    main_data_path_by_export = main_data_path.replace(main_data_name, "")
    cover_image_name = str(cover_image_path).split("/")[-1]
    cover_image_path_by_export = cover_image_path.replace(cover_image_name, "")

    # cover_imageをwebpに変換 横幅1200px
    if "webp" in instance.cover_image:
        cmd = f'ffmpeg -i {cover_image_path} -vf scale=1200:-1 {cover_image_path_by_export}cover_image.webp'
        code = subprocess.call(cmd.split())
        print('process=' + str(code))
        cover_image_path_by_export = cover_image_path_by_export.replace("media/", "")
        instance.cover_image = f'{cover_image_path_by_export}cover_image.webp'
        file_data_save(instance)


    if instance.main_data_type == "video":

        # m3u8の作成([input].mp4 -> ls/ls.m3u8)
        os.makedirs(f'{main_data_path_by_export}ls', exist_ok=True)
        cmd = 'ffmpeg'
        cmd += f' -i {main_data_path}'
        cmd += ' -codec copy -vbsf h264_mp4toannexb -map 0'
        cmd += ' -f segment -segment_format mpegts -segment_time 6'
        cmd += f' -segment_list {main_data_path_by_export}ls/ls.m3u8'
        cmd += f' {main_data_path_by_export}ls/ls_%5d.ts'
        code = subprocess.call(cmd.split())
        print('process=' + str(code))
        instance.video_encode_status = "m3u8"
        file_data_save(instance)

        # short.mp4, short.webp作成
        t_while = 1.5 # 切り取り秒数
        export_video_ren = 5 # shortvideo作成数
        cap = cv2.VideoCapture(main_data_path)
        play_time = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS) # 動画の時間(s)

        # ss_t: 切り取り開始秒数
        create_videos = [
            {"video_id": 1, "ss_t": 5},
            {"video_id": 2, "ss_t": math.floor(play_time / 4)},
            {"video_id": 3, "ss_t": math.floor(play_time / 2)},
            {"video_id": 4, "ss_t": math.floor((play_time / 4) * 3)},
            {"video_id": 5, "ss_t": math.floor(play_time - 15)},
        ]

        # 切り取り開始時間(ss_t)と、切り取りの時間(t_while)の調整
        if play_time < 30:
            export_video_ren = 1
            create_videos = [{"video_id": 1, "ss_t": 0}]
            t_while = 8
            if play_time < 10:
                t_while = play_time - 0.5
        if 30 <= play_time and play_time < 120: # 30秒以上120秒未満の場合は、動画時間の半分から切り取る
            export_video_ren = 1
            create_videos = create_videos[2]
            t_while = 8

        # 並列処理でshort.mp4を作成する関数
        def process_short_video(item):
            cmd = f'ffmpeg -ss {item["ss_t"]} -i {main_data_path} -t {t_while} -c copy {main_data_path_by_export}short_{item["video_id"]}.mp4'
            code = subprocess.call(cmd.split())
            print('process=' + str(code))

        # ThreadPoolExecutorを使って並列処理でshort.mp4を作成
        with ThreadPoolExecutor() as executor:
            executor.map(process_short_video, create_videos)

        instance.video_encode_status = "short"
        file_data_save(instance)

        # 切り取り&分割された動画を連結させ1つのmp4を作成 -> 作成されたmp4をwebpに変換
        short_videos = []
        i = 1
        while i <= export_video_ren:
            short_videos.append(f"file 'short_{i}.mp4'")
            i += 1
        write_text = "\n".join(short_videos)
        f = open(f'{main_data_path_by_export}short_videos.txt', 'w')
        f.write(write_text)
        f.close()
        cmd = f'ffmpeg -f concat -safe 0 -i {main_data_path_by_export}short_videos.txt -c copy {main_data_path_by_export}short.mp4'
        code  = subprocess.call(cmd.split())
        print('process=' + str(code))
        cmd = f'ffmpeg -i {main_data_path_by_export}short.mp4  -vb 100k  -vf scale=-1:180  -r 20 -pix_fmt pal8 {main_data_path_by_export}short.webp'
        code = subprocess.call(cmd.split())
        print('process=' + str(code))
        i = 1
        while i <= export_video_ren:
            path = f'{main_data_path_by_export}short_{i}.mp4'
            os.remove(path)
            i += 1

        cap = cv2.VideoCapture(f'{main_data_path_by_export}short.mp4')
        short_video_play_time = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
        instance.short_video_play_time = short_video_play_time

        os.remove(f'{main_data_path_by_export}short_videos.txt')
        os.remove(f'{main_data_path_by_export}short.mp4')

        instance.main_data_size = os.path.getsize(main_data_path)
        main_data_path_by_export = main_data_path_by_export.replace("media/", "")
        instance.main_data = main_data_path_by_export + "ls/ls.m3u8"
        instance.short_video_path = f'{main_data_path_by_export}short.webp'

        instance.video_encode_status = "encoded"
        file_data_save(instance)


def file_data_save(instance):
    from core.models import FileData
    instance.save(update_fields=['video_encode_status', 'short_video_path', 'main_data', 'main_data_size', 'short_video_play_time', 'cover_image'])
    send_update_file_data(FileData, instance)