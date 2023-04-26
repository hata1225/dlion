import json
from channels.generic.websocket import AsyncWebsocketConsumer

class WebRTCConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["chat_room_id"]
        self.room_group_name = f"webrtc_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')
        type = text_data_json.get('type')

        if type in ["join-room", "update_sdp"]:
            # Handle join-room event here
            # callerID: connect時に生成された呼び出し元識別子(self.channel_name)
            print(self.channel_name)
            if type == "join-room":
                type = "user_joined"
            await self.channel_layer.group_send(self.room_group_name, {"type": type, "callerID": self.channel_name})
        elif type in ["offer", "answer"]:
            # Handle offer, answer, and candidate events here
            await self.channel_layer.group_send(self.room_group_name, {"type": type, **text_data_json})
        elif type == "webrtc_signal":
            await self.channel_layer.group_send(self.room_group_name, {"type": "webrtc_message", "message": message})

    async def webrtc_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))

    async def user_joined(self, event):
        print("--user_joined method--")
        callerID = event["callerID"]
        await self.send(text_data=json.dumps({"type": "user-joined", "callerID": callerID, "currentUserID": self.channel_name}))

    async def update_sdp(self, event):
        callerID = event["callerID"]
        await self.send(text_data=json.dumps({"type": "update_sdp", "callerID": callerID, "currentUserID": self.channel_name}))

    async def offer(self, event):
        # Send offer event to the target user
        await self.send(text_data=json.dumps({
            "type": "offer",
            "sdp": event["sdp"],
            "callerID": event["callerID"],
            "currentUserID": self.channel_name,  # あなたの実装に応じてcurrentUserIDを設定してください
        }))

    async def answer(self, event):
        # Send answer event to the target user
        await self.send(text_data=json.dumps({
            "type": "answer",
            "sdp": event["sdp"],
            "callerID": event["callerID"],
            "currentUserID": self.channel_name,  # あなたの実装に応じてcurrentUserIDを設定してください
        }))