"""
ASGI config for dlion_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from user.consumers import FollowInfoConsumer
from file_data.consumers import FileDataConsumer
from chat.consumers import ChatRoomsConsumer, ChatRoomConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dlion_project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/chat_rooms/<str:user_id>/', ChatRoomsConsumer.as_asgi()),
            path('ws/chat_room/<str:chat_room_id>/', ChatRoomConsumer.as_asgi()),
            path('ws/follow/<str:user_id>/', FollowInfoConsumer.as_asgi()),
            path('ws/filedata/<str:file_data_id>/', FileDataConsumer.as_asgi()),
        ])
    ),
})
