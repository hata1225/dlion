import json
import aiohttp
from channels.generic.websocket import AsyncWebsocketConsumer
from core import models
from asgiref.sync import sync_to_async
from user import serializers
from core.usecase.mediafile_changepath import update_changepath

class FollowInfoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        await self.channel_layer.group_add(self.user_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.user_id, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get("action")

        if action == "fetch_follow_info":
            follow_info = await follow_info_by_user_id(self.user_id)
            await self.send_follow_data({"type": "follow_info", "data": follow_info})

    async def follow_update(self, event):
        follow_info = await follow_info_by_user_id(self.user_id)
        await self.send(text_data=json.dumps({"type": "follow_update", "data": follow_info}))

    async def send_follow_data(self, event):
        await self.send(text_data=json.dumps(event))

    async def fetch_api_data(self, api_url):
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url) as resp:
                data = await resp.json()
                return data

async def follow_info_by_user_id(user_id):
    friendships_following = await sync_to_async(models.FriendShip.objects.filter)(created_user__id=user_id)
    friendships_follower = await sync_to_async(models.FriendShip.objects.filter)(following_user__id=user_id)
    following_users = await sync_to_async(lambda: [friendship.following_user for friendship in friendships_following])()
    follower_users = await sync_to_async(lambda: [friendship.created_user for friendship in friendships_follower])()
    serializer_following = serializers.UserSerializer(following_users, many=True)
    serializer_follower = serializers.UserSerializer(follower_users, many=True)
    follow_info = {
        "following": serializer_following.data,
        "follower": serializer_follower.data,
    }
    return follow_info


