from io import StringIO
from unicodedata import category
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
import json

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


class VideoDataStatus(models.Model):
    video_id = models.IntegerField(null=False)
    video_data_status = models.TextField(default=json.dumps({'hm3u8': 0, 'lowmp4': 0, 'lm3u8': 0, 'playlist': 0, 'allcomplete': 0, 'completetotal': 0 }))


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

    #??????
    title = models.CharField(max_length=70, null=False)
    description = models.TextField(null=True)
    created_at = models.DateField(auto_now_add=True)
    categories = models.TextField(null=False, default=json.dumps([]))
    cover_image = models.FileField(upload_to=saveCoverDataPath, null=True)
    main_data_size = models.CharField(max_length=1000, default=0)
    main_data_type = models.TextField(default="none") # none | video | image | pdf | audio

    #?????? video ??????
    video_data = models.FileField(upload_to=saveMainDataPath, null=True)
        # lowmp4=>?????????mp4 playlist=>????????????????????????m3u8 allcomplete=>????????????????????? completetotal(0~4)=>?????????????????????
    video_data_status = models.TextField(default=json.dumps({'hm3u8': 0, 'lowmp4': 0, 'lm3u8': 0, 'playlist': 0, 'allcomplete': 0, 'completetotal': 0 }))
    short_video_path = models.TextField(default="")

    #?????? images ??????

    #pdf pdf ??????

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.id is None:
            # ?????????????????????????????????????????????????????????????????????
            cover_image = self.cover_image
            video_data = self.video_data

            # ??????file??????????????????Null??????????????????(?????????????????????ID????????????????????????)
            self.cover_image = None
            self.video_data = None
            super().save(*args, **kwargs)

            # file?????????????????????????????????
            self.cover_image = cover_image
            self.video_data = video_data
            if "force_insert" in kwargs:
                kwargs.pop("force_insert")

        # ????????????????????????????????????ID???????????????
        super().save(*args, **kwargs)

        categories_objects = Categories.objects.all()
        file_data_categories = json.loads(self.categories)
        all_categories = []

        for category_object in categories_objects:
            all_categories.append(category_object.category)

        for file_data_category in file_data_categories:
            if not file_data_category in all_categories:
                Categories.objects.create(category=file_data_category, user=self.user)