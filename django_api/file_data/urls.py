from django.urls import path, include
from rest_framework.routers import DefaultRouter

from file_data import views


router = DefaultRouter()
router.register('file_data', views.FileDataViewSet)

app_name = 'file_data'

urlpatterns = [
    path('', include(router.urls))
]