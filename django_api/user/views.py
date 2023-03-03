from rest_framework import generics, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from user import serializers

from core import models

class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer

class CreateTokenView(ObtainAuthToken):
    serializer_class = serializers.AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


class FollowUserView(generics.CreateAPIView):
    queryset = models.FriendShip.objects.all()
    serializer_class = serializers.FriendShipSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        followed_user = models.User.objects.get(id=request.GET.get('user_id'))
        # 自分自身をフォローしようとする場合
        if followed_user == request.user:
            return Response({'detail': 'You cannot follow yourself.'}, status=400)
        # すでにフォローをしている場合
        if models.FriendShip.objects.filter(created_user=request.user, followed_user=followed_user).exists():
            return Response({'detail': 'You already follow this user.'}, status=400)
        serializer = self.get_serializer(data={'followed_user': followed_user.id})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def perform_create(self, serializer):
        serializer.save(created_user=self.request.user)


class GetUserView(generics.RetrieveAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    lookup_field='pk'