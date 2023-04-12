from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from django.db.models.signals import post_save, post_delete
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
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
    return f'icon/{instance.id}/{instance.id}/{instance.id}.{ext}'

def saveBackgroundImagePath(instance, filename):
    ext = filename.split('.')[-1]
    return f'background/{instance.id}/{instance.id}/{instance.id}.{ext}'

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
    
    def create_user_from_google(self, email, social_id, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, social_id=social_id, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    social_id = models.CharField(max_length=255, unique=True, null=True)
    email = models.EmailField(max_length=255, null=False, unique=True)
    name = models.CharField(max_length=50, null=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    icon_image = models.FileField(upload_to=saveIconImagePath, null=True)
    background_image = models.FileField(upload_to=saveBackgroundImagePath, null=True)
    description = models.CharField(max_length=255, null=True)
    objects = UserManager()
    USERNAME_FIELD = 'email'


class FriendShip(models.Model):
    """
    @created_user: apiを叩いたユーザー(ログインユーザー)
    @following_user: apiのクエリパラメーター(user_id)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_user_friendships')
    following_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_user_friendships')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('created_user', 'following_user')


class Categories(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
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
    created_at = models.DateTimeField(auto_now_add=True)
    categories = models.TextField(null=False, default=json.dumps([]))
    cover_image = models.FileField(upload_to=saveCoverDataPath, null=True)
    main_data_size = models.CharField(max_length=1000, default=0)
    main_data_type = models.TextField(default="none") # none | video | image | pdf | audio
    main_data = models.FileField(upload_to=saveMainDataPath, null=True)
    video_encode_status = models.CharField(max_length=50, null=False, default="not_encoded") # not_encoded | m3u8 | short | encoded
    short_video_path = models.FileField(null=True)
    short_video_play_time = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        from core.tasks import video_encode_task
        is_new = self._state.adding # 追加されたばかりのオブジェクトかどうかを確認するフラグ
        super().save(*args, **kwargs)
        if is_new:
            video_encode_task.delay(self.id)

    def __str__(self):
        return self.title


# websocket用、更新があった際に発火
def send_update_follow(sender, instance, **kwargs):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        str(instance.created_user_id),
        {
            'type': 'follow_update',
        },
    )
    async_to_sync(channel_layer.group_send)(
        str(instance.following_user_id),
        {
            'type': 'follow_update',
        },
    )
def send_update_file_data(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        str(instance.id),
        {
            'type': 'file_data_update',
        },
    )

post_save.connect(send_update_follow, sender=FriendShip)
post_delete.connect(send_update_follow, sender=FriendShip)
post_save.connect(send_update_file_data, sender=FileData)
post_delete.connect(send_update_file_data, sender=FileData)