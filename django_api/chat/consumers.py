import json
import aiohttp
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Chat, ChatRoom
from core.models import User
from asgiref.sync import sync_to_async
from chat.serializers import ChatRoomSerializer, ChatSerializer

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

        if action == "fetch_chat_rooms":
            chat_rooms = await chat_rooms_by_user_id(self.user_id)
            await self.send(text_data=json.dumps({"type": "chat_rooms", "data": chat_rooms}))

    async def chat_rooms_update(self, event):
        chat_rooms = await chat_rooms_by_user_id(self.user_id)
        await self.send(text_data=json.dumps({"type": "chat_rooms_update", "data": chat_rooms}))

    async def fetch_api_data(self, api_url):
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url) as resp:
                data = await resp.json()
                return data

async def chat_rooms_by_user_id(user_id):
    user = await sync_to_async(User.objects.get)(id=user_id)
    chat_rooms = await sync_to_async(ChatRoom.objects.filter)(users=user)
    response_data = []

    for chat_room in chat_rooms:
        chat_room_serializer = ChatRoomSerializer(chat_room)
        latest_chat = await sync_to_async(Chat.objects.filter)(chat_room=chat_room)
        latest_chat = await sync_to_async(latest_chat.order_by)('-created_at')
        latest_chat = await sync_to_async(latest_chat.first)()
        chat_serializer = ChatSerializer(latest_chat)

        chat_room_data = chat_room_serializer.data
        chat_room_data['latest_chat'] = chat_serializer.data
        response_data.append(chat_room_data)

    return response_data
