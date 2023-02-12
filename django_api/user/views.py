from rest_framework import generics, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from user import serializers

from core import models

class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer

class CreateTokenView(ObtainAuthToken):
    serializer_class = serializers.AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

class FriendShipViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.FriendShipSerializer
    queryset = models.FriendShip.objects.all()
    def get_queryset(self):
        return models.FriendShip.objects.filter(user=self.request.user)
    # def create(self, request):
    #     # return models.FriendShip.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        followee = self.request.GET.get("user_id")
        # followee = self.request
        print("followee: ", followee)
        # serializer.save(followee=followee, follower=self.request.user)



class GetUserView(generics.RetrieveAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    lookup_field='pk'