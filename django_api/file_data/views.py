from rest_framework import viewsets, pagination, response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from core.models import FileData
from core.models import Categories

from file_data import serializers
import shutil

class FileDataPagination(pagination.PageNumberPagination):
    page_size = 20

    def get_paginated_response(self, data):
        return response.Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data,
            'page_size': self.page_size,
            'range_first': (self.page.number * self.page_size) - (self.page_size) + 1,
            'range_last': min((self.page.number * self.page_size), self.page.paginator.count),
        })

class FileDataViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.FileDataSerializer
    queryset = FileData.objects.order_by('-created_at')
    pagination_class = FileDataPagination

    def destroy(self, request, *args, **kwargs):
        id = self.request.path.split("/")[3]
        user_id = self.request.user.id
        mainDataPath = f'media/main/{user_id}/{id}'
        subDataPath = f'media/sub/{user_id}/{id}'
        try:
            shutil.rmtree(mainDataPath)
            shutil.rmtree(subDataPath)
        except:
            print("delete error")
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return FileData.objects.filter(Q(user__is_private=False)|Q(user=self.request.user))

class CategoriesViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.CategoriesSerializer
    queryset = Categories.objects.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Categories.objects.filter(user=self.request.user)
