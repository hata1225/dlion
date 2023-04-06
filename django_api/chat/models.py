from django.db import models
from core.models import User
from django.conf import settings
import uuid


class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    users = models.ManyToManyField(User)
    created_at = models.DateField(auto_created=True)


class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey(ChatRoom, null=False, on_delete=models.CASCADE)
    message = models.CharField(max_length=2000, null=False, default="")
    created_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    created_at = models.DateField(auto_now_add=True)
