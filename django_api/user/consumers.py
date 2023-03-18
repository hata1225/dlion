import json
import aiohttp
from channels.generic.websocket import AsyncWebsocketConsumer
from core import models
from asgiref.sync import sync_to_async
from user import serializers

class FollowConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        await self.channel_layer.group_add(self.user_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.user_id, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        user_id = self.user_id
        user = await sync_to_async(models.User.objects.get)(id=user_id)

        if action == 'fetch_following':
            friendships = await sync_to_async(models.FriendShip.objects.filter)(created_user=user)
            following_users = await sync_to_async(lambda: [friendship.following_user for friendship in friendships])()
            serializer = serializers.UserSerializer(following_users, many=True)
            await self.send_follow_data({'type': 'following_data', 'data': serializer.data})

        elif action == 'fetch_followers':
            friendships = await sync_to_async(models.FriendShip.objects.filter)(following_user=user)
            created_users = await sync_to_async(lambda: [friendship.created_user for friendship in friendships])()
            serializer = serializers.UserSerializer(created_users, many=True)
            await self.send_follow_data({'type': 'followers_data', 'data': serializer.data})

    async def send_follow_data(self, event):
        await self.send(text_data=json.dumps(event))

    async def fetch_api_data(self, api_url):
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url) as resp:
                data = await resp.json()
                return data


