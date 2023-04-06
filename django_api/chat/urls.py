from django.urls import path
from rest_framework.routers import DefaultRouter
from chat import views

app_name = 'chat'

router = DefaultRouter()

urlpatterns = [
    path('chat_rooms/', views.GetChatRoomsByUserAPIView.as_view(), name='get_chat_rooms_by_user'),
    path('chat_room/', views.GetChatRoomAPIView.as_view(), name='get_chat_room'),
    path('create_chat_room/', views.CreateChatRoomAPIView.as_view(), name='create_chat_room'),
    path('create_chat/', views.CreateChatAPIView.as_view(), name='create_chat'),
     *router.urls
]
