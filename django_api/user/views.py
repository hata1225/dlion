from rest_framework import generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from social_core.exceptions import MissingBackend
from social_core.backends.oauth import BaseOAuth2
from social_django.utils import load_strategy
from rest_framework.authtoken.models import Token
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


class GoogleAuthView(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({'error': 'Access token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            backend = load_strategy().get_backend('google-oauth2')
        except MissingBackend:
            return Response({'error': 'Google backend not found.'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(backend, BaseOAuth2):
            return Response({'error': 'Google authentication failed.'}, status=status.HTTP_400_BAD_REQUEST)

        # Google OAuth2からユーザー情報を取得
        authenticated_user = backend.do_auth(access_token)
        if not authenticated_user:
            return Response({'error': 'Google authentication failed.'}, status=status.HTTP_400_BAD_REQUEST)

        user_data = {
            'id': authenticated_user.social_auth.get(provider='google-oauth2').uid,
            'email': authenticated_user.email,
            'name': authenticated_user.name,
        }

        # Google OAuth2から取得した情報を使ってユーザーを作成または取得
        user = models.User.objects.get_or_create(
            email=user_data.get('email'),
            defaults={
                'social_id': user_data.get('id'),
                'name': user_data.get('name'),
                'is_active': True,
                'is_staff': False,
                'is_private': False,
            }
        )[0]

        if not user.is_active:
            return Response({'error': 'User is not active.'}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)


class FollowUserView(generics.CreateAPIView):
    queryset = models.FriendShip.objects.all()
    serializer_class = serializers.FriendShipSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        following_user = models.User.objects.get(id=request.GET.get('user_id'))
        # 自分自身をフォローしようとする場合
        if following_user == request.user:
            return Response({'detail': 'You cannot follow yourself.'}, status=400)
        # すでにフォローをしている場合
        if models.FriendShip.objects.filter(created_user=request.user, following_user=following_user).exists():
            return Response({'detail': 'You already follow this user.'}, status=400)
        serializer = self.get_serializer(
            data={'following_user': following_user.id})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def perform_create(self, serializer):
        serializer.save(created_user=self.request.user)


class UnfollowAPIView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def delete(self, request):
        user = request.user
        following_user = models.User.objects.get(id=request.GET.get('user_id'))
        try:
            friendship = models.FriendShip.objects.get(
                created_user=user, following_user=following_user)
            friendship.delete()
        except models.FriendShip.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


# 対象のユーザーのフォローしている一覧を返す
# クエリパラメータがからの場合は、対象がcurrentuserになる
class FollowingListAPIView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        userId = request.GET.get('user_id')
        if userId:
            user = models.User.objects.get(id=request.GET.get('user_id'))

        friendships = models.FriendShip.objects.filter(created_user=user)
        following_users = [
            friendship.following_user for friendship in friendships]
        serializer = serializers.UserSerializer(following_users, many=True)
        return Response(serializer.data)


# 対象のユーザーのフォロワー一覧を返す
# クエリパラメータがからの場合は、対象がcurrentuserになる
class FollowerListAPIView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        userId = request.GET.get('user_id')
        if userId:
            user = models.User.objects.get(id=request.GET.get('user_id'))

        friendships = models.FriendShip.objects.filter(following_user=user)
        created_users = [friendship.created_user for friendship in friendships]
        serializer = serializers.UserSerializer(created_users, many=True)
        return Response(serializer.data)


class GetUserView(generics.RetrieveAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    lookup_field = 'pk'
