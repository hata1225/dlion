from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from chat.models import ChatRoom
from chat.serializers import ChatSerializer, ChatRoomSerializer


class CreateChatRoomAPIView(APIView):
    """
    ### fromdata
    - users: [list[string:user_id]]ユーザーIDのリスト
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            serializer = ChatRoomSerializer(data=request.data)
            if serializer.is_valid():
                chat_room = serializer.save()
                return Response(ChatRoomSerializer(chat_room).data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateChatAPIView(APIView):
    """
    ### formdata
    - chat_room_id: [string]ChatRoomのID
    - message: [string]メッセージ本文
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user = request.user
            serializer = ChatSerializer(data=request.data)
            chat_room_id = serializer.validated_data["chat_room_id"]
            message = serializer.validated_data["message"]
            chat_room = ChatRoom.objects.get(id=chat_room_id)
            is_exist_chat_room_by_user = user in chat_room.users.all()
            if not bool(chat_room):
                return Response(status=status.HTTP_404_NOT_FOUND)
            if not is_exist_chat_room_by_user:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            serializer.save(chat_room=chat_room, message=message, created_user=request.user)
            return Response(status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)