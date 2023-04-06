from rest_framework import serializers
from chat.models import ChatRoom, Chat
from user.serializers import UserSerializer


class ChatRoomSerializer(serializers.ModelSerializer):

    users = UserSerializer(many=True)

    class Meta:
        model = ChatRoom
        fields = ("id", "users", "created_at")
        read_only_fields = ("id", "created_at")


class ChatSerializer(serializers.ModelSerializer):

    chat_room = ChatRoomSerializer(read_only=True)
    created_user = UserSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ("id", "chat_room", "message", "created_user", "created_at")
        read_only_fields = ("id", "chat_room", "created_user", "created_at")