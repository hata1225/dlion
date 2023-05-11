import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Chat, ChatRoom
from core.models import User
from asgiref.sync import sync_to_async
from chat.serializers import ChatRoomSerializer, ChatSerializer
from user.serializers import UserSerializer
from user.services import get_user_from_token, checked_exist_user_from_chatroom


class ChatRoomsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        await self.channel_layer.group_add(self.user_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.user_id, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get("action")

        # コネクション確立後、初回の接続
        if action == "fetch_chat_rooms":
            chat_rooms = await chat_rooms_by_user_id(self.user_id)

            # 認証部分
            token = text_data_json.get("token")
            user_from_token = await sync_to_async(get_user_from_token)(token)
            user_serializer = UserSerializer(user_from_token).data
            users_from_chat_rooms = []
            for chat_room in chat_rooms:
                for user in chat_room["users"]:
                    users_from_chat_rooms.append(user)
            is_exist_user = user_serializer in users_from_chat_rooms
            if not is_exist_user:
                raise

            await self.send(text_data=json.dumps({"type": "chat_rooms", "data": chat_rooms}))

    async def chat_rooms_update(self, event):
        chat_rooms = await chat_rooms_by_user_id(self.user_id)
        await self.send(text_data=json.dumps({"type": "chat_rooms_update", "data": chat_rooms}))


async def chat_rooms_by_user_id(user_id):
    user = await sync_to_async(User.objects.get)(id=user_id)
    chat_rooms = await sync_to_async(ChatRoom.objects.filter)(users=user)
    response_data = await sync_to_async(create_chat_rooms_data)(chat_rooms)
    return response_data


def create_chat_rooms_data(chat_rooms):
    response_data = []
    for chat_room in chat_rooms:
        chat_room_data = ChatRoomSerializer(chat_room).data
        latest_chat = Chat.objects.filter(
            chat_room=chat_room).order_by('-created_at').first()
        chat_room_data['latest_chat'] = ChatSerializer(latest_chat).data
        response_data.append(chat_room_data)
    return response_data


class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_room_id = self.scope["url_route"]["kwargs"]["chat_room_id"]
        await self.channel_layer.group_add(self.chat_room_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.chat_room_id, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get("action")

        # コネクション確立後、初回の接続
        if action == "fetch_chat_room":
            chat_room = await sync_to_async(chat_room_by_id)(self.chat_room_id)

            # 認証部分
            token = text_data_json.get("token")
            await sync_to_async(checked_exist_user_from_chatroom)(token, self.chat_room_id)

            await self.send(text_data=json.dumps({"type": "chat_room", "data": chat_room}))

    async def chat_room_update(self, event):
        chat_room = await sync_to_async(chat_room_by_id)(self.chat_room_id)
        await self.send(text_data=json.dumps({"type": "chat_room_update", "data": chat_room}))


def chat_room_by_id(chat_room_id):
    chat_room = ChatRoom.objects.get(id=chat_room_id)
    chats = Chat.objects.filter(chat_room=chat_room).order_by('created_at')
    chat_room_data = ChatRoomSerializer(chat_room).data
    chats_data = ChatSerializer(chats, many=True).data
    return {"chat_room": chat_room_data, "chats": chats_data}
