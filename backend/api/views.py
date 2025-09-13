from rest_framework import generics, viewsets
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Veiculo, Entrega, Lead
from .serializers import VeiculoSerializer, EntregaSerializer, MyTokenObtainPairSerializer, RegisterSerializer, LeadSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LeadCreateView(generics.CreateAPIView):
    queryset = Lead.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = LeadSerializer

class VeiculoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # Protege o endpoint
    queryset = Veiculo.objects.all().order_by('-criado_em')
    serializer_class = VeiculoSerializer

class EntregaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # Protege o endpoint
    queryset = Entrega.objects.all().order_by('-criado_em')
    serializer_class = EntregaSerializer