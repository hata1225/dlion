from django.contrib.auth import get_user_model, authenticate

from rest_framework import serializers
from core import models


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'name', 'is_private', 'icon_image', 'background_image', 'description')

        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user

class FriendShipSerializer(serializers.Serializer):
    def create(self, validated_data):
        created_user = self.context['request'].user
        following_user = models.User.objects.get(id=self.context['request'].GET.get('user_id'))
        return models.FriendShip.objects.create(created_user=created_user, following_user=following_user)

class AuthTokenSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        if not user:
            msg = ('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs