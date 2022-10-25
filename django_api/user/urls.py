from django.urls import path
from rest_framework.routers import DefaultRouter

from user import views


app_name = 'user'

router = DefaultRouter()
router.register('followee', views.FolloweeViewSet)

urlpatterns = [
     path('create/', views.CreateUserView.as_view(), name='create'),
     path('token/', views.CreateTokenView.as_view(), name='token'),
     path('update/', views.ManageUserView.as_view(), name='update'),
     path('get/<str:pk>/', views.GetUserView.as_view(), name='get'),
     *router.urls
]