from django.urls import re_path
from user import consumers

websocket_urlpatterns = [
    re_path(r'ws/follow/(?P<user_id>[^/]+)/$', consumers.FollowConsumer.as_asgi()),
]