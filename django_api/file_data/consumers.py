import json
import aiohttp
from channels.generic.websocket import AsyncWebsocketConsumer
from core import models
from asgiref.sync import sync_to_async
from file_data import serializers

class FileDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.file_data_id = self.scope["url_route"]["kwargs"]["file_data_id"]
        await self.channel_layer.group_add(self.file_data_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.file_data_id, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get("action")

        if action == "fetch_file_data":
            file_data = await file_data_by_id(self.file_data_id)
            await self.send(text_data=json.dumps({"type": "file_data", "data": file_data}))

    async def file_data_update(self, event):
        file_data = await file_data_by_id(self.file_data_id)
        await self.send(text_data=json.dumps({"type": "file_data_update", "data": file_data}))

    async def fetch_api_data(self, api_url):
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url) as resp:
                data = await resp.json()
                return data

async def file_data_by_id(file_data_id):
    file_data = await sync_to_async(models.FileData.objects.get)(id=file_data_id)
    serializer_file_data = await sync_to_async(serializers.FileDataSerializer)(file_data)
    file_data_representation = await sync_to_async(lambda: serializer_file_data.data)()
    return file_data_representation
