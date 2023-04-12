from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from chat.models import ChatRoom, Chat
from core.models import User
from chat.serializers import ChatSerializer, ChatRoomSerializer
import re


class GetChatRoomsByCurrentUserAPIView(APIView):
    """
    現在のuserが含まれるChatRoomと、それに紐づく最新のChat1件を取得

    ---
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            user = request.user
            chat_rooms = ChatRoom.objects.filter(users=user)
            response_data = []

            for chat_room in chat_rooms:
                chat_room_serializer = ChatRoomSerializer(chat_room)
                latest_chat = Chat.objects.filter(chat_room=chat_room).order_by('-created_at').first()
                chat_serializer = ChatSerializer(latest_chat)

                chat_room_data = chat_room_serializer.data
                chat_room_data['latest_chat'] = chat_serializer.data
                response_data.append(chat_room_data)

            return Response(response_data)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)



class GetChatRoomAPIView(APIView):
    """
    ChatRoomの取得と、紐付いたChatの取得

    ---
    ### formdata
    - chat_room_id: (string)ChatRoomのID
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            chat_room_id = request.GET.get('chat_room_id')

            # formdataにchat_room_idが含まれているか
            if not chat_room_id:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # 指定されたchat_room_idが存在するか
            if ChatRoom.objects.filter(id=chat_room_id).exists():
                return Response(status=status.HTTP_404_NOT_FOUND)

            chat_room = ChatRoom.objects.get(id=chat_room_id)
            chats = Chat.objects.filter(chat_room__id=chat_room_id)
            chat_room_serializer = ChatRoomSerializer(chat_room)
            chat_serializer = ChatSerializer(chats, many=True)
            response_data = chat_room_serializer.data
            response_data['chats'] = chat_serializer.data
            return Response(response_data)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateChatRoomAPIView(APIView):
    """
    ChatRoomの作成

    ---
    ### formdata
    - user_ids: (string[])ユーザーIDのリスト
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user = request.user

            user_ids = []
            for key, value in request.data.items():
                match = re.match(r'user_ids\[(\d+)\]', key)
                if match:
                    index = int(match.group(1))
                    user_ids.insert(index, value)

            if not str(user.id) in user_ids:
                user_ids.append(str(user.id))

            # 重複チェック(chatroom作成時に重複したパターンのuser_idsがないかチェック)
            chatroom = ChatRoom.objects.filter(users__id__in=user_ids).first()

            # 重複チェックしてなかったら新しく作成
            if not chatroom:
                users = User.objects.filter(id__in=user_ids)
                chatroom = ChatRoom.objects.create()
                chatroom.users.set(users)
                chatroom.save()
            return Response(ChatRoomSerializer(chatroom).data,status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateChatAPIView(APIView):
    """
    Chatの作成(メッセージ送信時)

    ---
    ### formdatap
    - chat_room_id: (string)ChatRoomのID
    - message: (string)メッセージ本文
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # return Response(status=status.HTTP_200_OK)
        try:
            user = request.user

            chat_room_id = request.data['chat_room_id']
            message = request.data.get('message')
            chat_room = ChatRoom.objects.filter(id=chat_room_id).first()
            if not chat_room: # チャットルームが存在しているか
                return Response(status=status.HTTP_404_NOT_FOUND)
            if not user in chat_room.users.all(): # チャットルームにuserが含まれているか
                return Response(status=status.HTTP_400_BAD_REQUEST)
            if message:
                Chat.objects.create(chat_room=chat_room, message=message, created_user=request.user)
            return Response(status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)