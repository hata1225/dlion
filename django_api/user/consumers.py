import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from core.models import FriendShip

User = get_user_model()

class FollowConsumer(WebsocketConsumer):
    def send_following_list(self, event):
        data = event['data']
        self.send(text_data=json.dumps({
            'type': 'following_list',
            'data': data
        }))

    def send_follower_list(self, event):
        data = event['data']
        self.send(text_data=json.dumps({
            'type': 'follower_list',
            'data': data
        }))

    def get_following_list(self):
        user = User.objects.get(id=self.user_id)
        friendships = FriendShip.objects.get(created_user=user)
        following_list = [friendship.following_user for friendship in friendships]
        return following_list

    def get_follower_list(self):
        user = User.objects.get(id=self.user_id)
        friendships = FriendShip.objects.filter(following_user=user)
        follower_list = [friendship.following_user for friendship in friendships]
        return follower_list
    
    def notify_following_list_change(self):
        following_list = self.get_following_list()
        async_to_sync(self.channel_layer.group_send)(
            self.user_id,
            {
                'type': 'send_following_list',
                'data': following_list
            }
        )

    def notify_follower_list_change(self):
        follower_list = self.get_follower_list()
        async_to_sync(self.channel_layer.group_send)(
            self.user_id,
            {
                'type': 'send_follower_list',
                'data': follower_list
            }
        )

    def handle_friendship_changed(self, sender, instance, **kwargs):
        if instance.created_user.id == self.user_id or instance.following_user.id == self.user_id:
            self.notify_following_list_change()
            self.notify_follower_list_change()

    def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        async_to_sync(self.channel_layer.group_add)(
            self.user_id,
            self.channel_name
        )
        self.accept()

        # ユーザーのフォロー一覧とフォロワー一覧を送信
        self.notify_following_list_change()
        self.notify_follower_list_change()

        # FriendShipの変更を監視
        FriendShip.post_save.connect(self.handle_friendship_changed)

    def disconnect(self, close_code):
        FriendShip.post_save.disconnect(self.handle_friendship_changed)
        async_to_sync(self.channel_layer.group_discard)(
            self.user_id,
            self.channel_name
        )