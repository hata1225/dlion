from django.db import models
from core.models import User
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save, post_delete
import uuid


class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    users = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)


class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey(ChatRoom, null=False, on_delete=models.CASCADE)
    message = models.CharField(max_length=2000, null=False, default="")
    created_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

# websocket用、更新があった際に発火
def send_update_chat_rooms(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        str(instance.id),
        {
            'type': 'chat_rooms_update',
        },
    )

def send_update_chat_room(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        str(instance.chat_room.id),
        {
            'type': 'chat_room_update',
        },
    )

post_save.connect(send_update_chat_rooms, sender=ChatRoom)
post_delete.connect(send_update_chat_rooms, sender=ChatRoom)
post_save.connect(send_update_chat_room, sender=Chat)
post_delete.connect(send_update_chat_room, sender=Chat)