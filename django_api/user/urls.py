from django.urls import path
from rest_framework.routers import DefaultRouter

from user import views


app_name = 'user'

router = DefaultRouter()

urlpatterns = [
     path('create/', views.CreateUserView.as_view(), name='create'),
     path('token/', views.CreateTokenView.as_view(), name='token'),
     path('update/', views.ManageUserView.as_view(), name='update'),
     path('get/<str:pk>/', views.GetUserView.as_view(), name='get'),
     path('follow/', views.FollowUserView.as_view(), name='follow_user'),
     path('unfollow/', views.UnfollowAPIView.as_view(), name='unfollow_user'),
     path('followinglist/', views.FollowingListAPIView.as_view(), name='following-list'),
     path('followerlist/', views.FollowerListAPIView().as_view(), name='follower-list'),
     *router.urls
]