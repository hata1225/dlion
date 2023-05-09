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
        type = text_data_json.get('type')
        userInfo = text_data_json.get('userInfo')
        event = {"callerID": self.channel_name, "userInfo": userInfo}
        if type == "join-room":
            event["type"] = "user_joined"
        elif type in ["offer", "answer", "renegotiate", "transceiverRequest", "stopStream"]:
            event["type"] = type
            event.update(text_data_json)
        await self.channel_layer.group_send(self.room_group_name, event)

    async def user_joined(self, event):
        await self.send_event(event)

    async def offer(self, event):
        await self.send_event(event, "sdp")

    async def answer(self, event):
        await self.send_event(event, "sdp")

    async def renegotiate(self, event):
        await self.send_event(event, "data")

    async def transceiverRequest(self, event):
        await self.send_event(event, "data")

    async def stopStream(self, event):
        await self.send_event(event)

    async def send_event(self, event, *args):
        data = {
            "type": event["type"],
            "callerID": event["callerID"],
            "currentUserID": self.channel_name,
            "userInfo": event["userInfo"]
        }
        if args:
            data[args[0]] = event[args[0]]
        await self.send(text_data=json.dumps(data))
