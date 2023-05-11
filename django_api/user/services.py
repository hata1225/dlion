from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
from chat.models import ChatRoom


def get_user_from_token(token_key: str):
    """
    tokenをもとにuserを取得
    (tokenが有効かチェックもできる)
    """
    try:
        token = Token.objects.get(key=token_key)
    except Token.DoesNotExist:
        raise AuthenticationFailed('Invalid token')

    if not token.user.is_active:
        raise AuthenticationFailed('User inactive or deleted')

    return token.user


def checked_exist_user_from_chatroom(token_key: str, chat_room_id: str):
    """
    tokenの認証チェック及び、token元userがchat_room_id(chat_room)との紐付けがされているかチェック
    """
    try:
        user_from_token = get_user_from_token(token_key)
        chat_room = ChatRoom.objects.get(id=chat_room_id)
        if not chat_room.users.filter(id=user_from_token.id).exists():
            raise ValueError("Invalid chatroom_id")
    except:
        raise ValueError("@checked_exist_user_from_chatroom is error")
