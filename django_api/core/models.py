from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
import json

class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('User must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Creates and saves a new superuser"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username"""
    email = models.EmailField(max_length=255, null=False, unique=True)
    name = models.CharField(max_length=255, null=False)
    favorites = models.TextField(default=json.dumps([]))
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

def saveCoverDataPath(instance, filename):
    ext = filename.split('.')[-1]
    return f'sub/{instance.user.name}/{instance.id}/{instance.id}.{ext}'

def saveMainDataPath(instance, filename):
    ext = filename.split('.')[-1]
    return f'main/{instance.user.name}/{instance.id}/{instance.id}.{ext}'

class FileData(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    #共通
    title = models.CharField(max_length=255, null=False)
    content = models.TextField(null=True)
    created_at = models.DateField(auto_now_add=True)
    categories = models.TextField(null=True, default=json.dumps([]))
    cover_image = models.FileField(upload_to=saveCoverDataPath, null=True)
    main_data_size = models.CharField(max_length=1000, default=0)
    main_data_status = models.TextField(default="none")

    #動画 video 単数
    video_data = models.FileField(upload_to=saveMainDataPath, null=True)
        # lowmp4=>低画質mp4 playlist=>低画質高画質混合m3u8 allcomplete=>エンコード完了 completetotal(0~4)=>エンコード状況
    video_data_status = models.TextField(default=json.dumps({'hm3u8': 0, 'lowmp4': 0, 'lm3u8': 0, 'playlist': 0, 'allcomplete': 0, 'completetotal': 0 }))
    short_video_path = models.TextField(default="")

    #画像 photos 複数

    #pdf pdf 単数

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.id is None:
            # アップロードされたファイルを変数に代入しておく
            cover_image = self.cover_image
            video_data = self.video_data

            # 一旦fileフィールドがNullの状態で保存(→インスタンスIDが割り当てられる)
            self.cover_image = None
            self.video_data = None
            super().save(*args, **kwargs)

            # fileフィールドに値をセット
            self.cover_image = cover_image
            self.video_data = video_data
            if "force_insert" in kwargs:
                kwargs.pop("force_insert")

            # この段階ではインスタンスIDが存在するので、_file_upload_path関数でinstance.idが使える
        super().save(*args, **kwargs)