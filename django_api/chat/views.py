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
    - user_ids: [list[string:user_id]]ユーザーIDのリスト
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            serializer = ChatRoomSerializer(data=request.data)
            user = request.user
            user_ids = serializer.validated_data["user_ids"]
            if not user.id in user_ids:
                user_ids.append(user.id)

            # 重複チェック(chatroom作成時に重複したパターンのuser_idsがないかチェック)
            is_exist_user_ids = ChatRoom.objects.filter(users__id__in=user_ids).count() > 0

            # シリアライザ成功(userのidが存在しているetc...) and 重複チェック
            if serializer.is_valid() and not is_exist_user_ids:
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
            chat_room_by_id = ChatRoom.objects.filter(id=chat_room_id).first()
            if not chat_room_by_id: # チャットルームが存在しているかチェック
                return Response(status=status.HTTP_404_NOT_FOUND)
            is_exist_chat_room_by_user = user in chat_room_by_id.users.all()
            if not is_exist_chat_room_by_user:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            serializer.save(chat_room=chat_room_by_id, message=message, created_user=request.user)
            return Response(status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)