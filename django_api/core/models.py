from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
import os
import subprocess
import cv2
import math
import json
import uuid

def saveCoverDataPath(instance, filename):
    ext = filename.split('.')[-1]
    return f'sub/{instance.user.id}/{instance.id}/{instance.id}.{ext}'

def saveMainDataPath(instance, filename):
    ext = filename.split('.')[-1]
    return f'main/{instance.user.id}/{instance.id}/{instance.id}.{ext}'

def saveIconImagePath(instance, filename):
    ext = filename.split('.')[-1]
    return f'icon/{instance.user.id}/{instance.id}/{instance.id}.{ext}'

def saveBackgroundImagePath(instance, filename):
    ext = filename.split('.')[-1]
    return f'background/{instance.user.id}/{instance.id}/{instance.id}.{ext}'

class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('User must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, null=False, unique=True)
    name = models.CharField(max_length=255, null=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    icon_image = models.FileField(upload_to=saveIconImagePath, null=True)
    background_image = models.FileField(upload_to=saveBackgroundImagePath, null=True)
    description = models.CharField(max_length=255, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

class Categories(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    created_at = models.DateField(auto_now_add=True)
    category = models.TextField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class FileData(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    #共通
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=70, null=False)
    description = models.TextField(null=True)
    created_at = models.DateField(auto_now_add=True)
    categories = models.TextField(null=False, default=json.dumps([]))
    cover_image = models.FileField(upload_to=saveCoverDataPath, null=True)
    main_data_size = models.CharField(max_length=1000, default=0)
    main_data_type = models.TextField(default="none") # none | video | image | pdf | audio
    main_data = models.FileField(upload_to=saveMainDataPath, null=True)

    #動画 video 単数
        # lowmp4=>低画質mp4 playlist=>低画質高画質混合m3u8 allcomplete=>エンコード完了 completetotal(0~4)=>エンコード状況
    video_data_status = models.TextField(default=json.dumps({'lsm3u8': 0, 'shortmp4': 0, 'allcomplete': 0, 'completetotal': 0 }))
    is_video_encoded = models.BooleanField(default=False)
    short_video_path = models.FileField(null=True)
    short_video_play_time = models.IntegerField(default=0)

    #画像 images 複数

    #pdf pdf 単数

    #音楽 audio 単数

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # fileDataに追加されたcategoryがCategoriesに存在しない場合、Categoriesに追加
        categories_objects = Categories.objects.all()
        file_data_categories = json.loads(self.categories)
        all_categories = []

        for category_object in categories_objects:
            all_categories.append(category_object.category)

        for file_data_category in file_data_categories:
            if not file_data_category in all_categories:
                Categories.objects.create(category=file_data_category, user=self.user)

        # 保存されたvideoData, cover_imageのパス, main_data名, export_path
        main_data_path = "media/"+str(self.main_data)
        cover_image_path = "media/"+str(self.cover_image)
        main_data_name = str(main_data_path).split("/")[-1]
        main_data_path_by_export = main_data_path.replace(main_data_name, "")
        cover_image_name = str(cover_image_path).split("/")[-1]
        cover_image_path_by_export = cover_image_path.replace(cover_image_name, "")

        # cover_imageをwebpに変換 横幅1200px
        if "webp" in self.cover_image:
            cmd = f'ffmpeg -i {cover_image_path} -vf scale=1200:-1 {cover_image_path_by_export}cover_image.webp'
            code = subprocess.call(cmd.split())
            print('process=' + str(code))
            cover_image_path_by_export = cover_image_path_by_export.replace("media/", "")
            self.cover_image = f'{cover_image_path_by_export}cover_image.webp'

        super().save()

        video_data_status = json.loads(self.video_data_status)

        # 動画は編集を想定していない
        if self.main_data_type == "video" and video_data_status["allcomplete"] == 0:

            # m3u8の作成([input].mp4 -> ls/ls.m3u8)
            os.makedirs(f'{main_data_path_by_export}ls')
            cmd = 'ffmpeg'
            cmd += f' -i {main_data_path}'
            cmd += ' -codec copy -vbsf h264_mp4toannexb -map 0'
            cmd += ' -f segment -segment_format mpegts -segment_time 12'
            cmd += f' -segment_list {main_data_path_by_export}ls/ls.m3u8'
            cmd += f' {main_data_path_by_export}ls/ls_%5d.ts'
            code = subprocess.call(cmd.split())
            print('process=' + str(code))
            video_data_status['lsm3u8'] = 1
            video_data_status['completetotal'] = 1
            self.video_data_status = json.dumps(video_data_status)
            super().save()

            # short.mp4, short.webp作成
            t_while = 1.5 # 切り取り秒数
            export_video_ren = 5 # shortvideo作成数
            cap = cv2.VideoCapture(main_data_path)
            play_time = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)

            create_videos = [
                {"video_id": 1, "ss_t": 5},
                {"video_id": 2, "ss_t": math.floor(play_time / 4)},
                {"video_id": 3, "ss_t": math.floor(play_time / 2)},
                {"video_id": 4, "ss_t": math.floor((play_time / 4) * 3)},
                {"video_id": 5, "ss_t": math.floor(play_time - 30)},
            ]

            if play_time < 150:
                create_videos.pop()
                export_video_ren = 4
            elif play_time < 120:
                t_while = 10
                create_videos = [{"video_id": 1, "ss_t": 5}]
                export_video_ren = 1
            elif play_time < 15:
                t_while = play_time - 0.5
                create_videos = [{"video_id": 1, "ss_t": 0}]
                export_video_ren = 1
            for item in create_videos:
                cmd = f'ffmpeg -ss {item["ss_t"]} -i {main_data_path} -t {t_while} -c copy {main_data_path_by_export}short_{item["video_id"]}.mp4'
                code = subprocess.call(cmd.split())
                print('process=' + str(code))
            f = open(f'{main_data_path_by_export}short_videos.txt', 'w')
            video_data_status = json.loads(self.video_data_status)
            video_data_status['shortmp4'] = 1
            video_data_status['completetotal'] = 2
            self.video_data_status = json.dumps(video_data_status)
            super().save()

            short_videos = []
            i = 1
            while i <= export_video_ren:
                short_videos.append(f"file 'short_{i}.mp4'")
                i += 1
            write_text = "\n".join(short_videos)
            f.write(write_text)
            f.close()
            cmd = f'ffmpeg -f concat -safe 0 -i {main_data_path_by_export}short_videos.txt -c copy {main_data_path_by_export}short.mp4'
            code  = subprocess.call(cmd.split())
            print('process=' + str(code))
            cmd = f'ffmpeg -i {main_data_path_by_export}short.mp4  -vb 100k  -vf scale=-1:180  -r 18 -pix_fmt pal8 {main_data_path_by_export}short.webp'
            code = subprocess.call(cmd.split())
            print('process=' + str(code))
            i = 1
            while i <= export_video_ren:
                path = f'{main_data_path_by_export}short_{i}.mp4'
                os.remove(path)
                i += 1

            cap = cv2.VideoCapture(f'{main_data_path_by_export}short.mp4')
            short_video_play_time = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
            self.short_video_play_time = short_video_play_time

            os.remove(f'{main_data_path_by_export}short_videos.txt')
            os.remove(f'{main_data_path_by_export}short.mp4')

            self.main_data_size = os.path.getsize(main_data_path)
            main_data_path_by_export = main_data_path_by_export.replace("media/", "")
            self.main_data = main_data_path_by_export + "ls/ls.m3u8"
            self.short_video_path = f'{main_data_path_by_export}short.webp'
            video_data_status = json.loads(self.video_data_status)
            video_data_status['allcomplete'] = 1
            video_data_status['completetotal'] = 3

            self.video_data_status = json.dumps(video_data_status)
            self.is_video_encoded = True
        super().save()

    def __str__(self):
        return self.title