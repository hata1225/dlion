from rest_framework import viewsets, pagination, response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import FileData
from core.models import Categories

from file_data import serializers

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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return FileData.objects.filter(user=self.request.user)

class CategoriesViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.CategoriesSerializer
    queryset = Categories.objects.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Categories.objects.filter(user=self.request.user)

class VideoDataStatusViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.VideoDataStatusSerializer
    queryset = Categories.objects.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
