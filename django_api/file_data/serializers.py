from rest_framework import serializers

from core.models import FileData
from core.models import Categories
from user.serializers import UserSerializer


class FileDataSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = FileData
        fields = ('id', 'user', 'title', 'description', 'created_at', 'categories', 'cover_image', 'main_data_size', 'main_data_type', 'main_data', 'video_encode_status', 'short_video_path', 'short_video_play_time')
        read_only_fields = ('id', 'user',)


class CategoriesSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Categories
        fields = ('id','user','created_at','category',)
        read_only_fields = ('id', 'user',)
