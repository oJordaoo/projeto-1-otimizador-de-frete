# backend/users/views.py

from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Endpoint de Login. Recebe username/email e senha.
    """
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """
    Endpoint de Registro. Cria um novo usuário.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer