from django.urls import path, include
from rest_framework.routers import DefaultRouter

from file_data import views


router = DefaultRouter()
router.register('file_data', views.FileDataViewSet)
router.register('categories', views.CategoriesViewSet)
router.register('video_data_status', views.VideoDataStatusViewSet)

app_name = 'file_data'

urlpatterns = router.urls