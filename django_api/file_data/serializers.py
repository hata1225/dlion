from dataclasses import fields
from rest_framework import serializers

from core.models import FileData
from core.models import Categories
from core.models import VideoDataStatus
from user.serializers import UserSerializer


class VideoDataStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoDataStatus
        fields = ('id', 'video_data_status',)
        read_only_fields = ('id',)


class FileDataSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)
    video_data_status = VideoDataStatusSerializer(read_only=True)

    class Meta:
        model = FileData
        fields = ('id', 'user', 'title', 'description', 'created_at', 'categories', 'cover_image', 'main_data_size', 'main_data_type', 'video_data', 'video_data_status', 'short_video_path')
        read_only_fields = ('id', 'user',)


class CategoriesSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Categories
        fields = ('id','user','created_at','category',)
        read_only_fields = ('id', 'user',)
