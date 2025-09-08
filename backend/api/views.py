from rest_framework import viewsets
from .models import Veiculo, Entrega
from .serializers import VeiculoSerializer, EntregaSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class VeiculoViewSet(viewsets.ModelViewSet):
    """
    Endpoint da API para visualizar e editar veículos.
    """
    queryset = Veiculo.objects.all().order_by('-criado_em')
    serializer_class = VeiculoSerializer

class EntregaViewSet(viewsets.ModelViewSet):
    """
    Endpoint da API para visualizar e editar entregas.
    """
    queryset = Entrega.objects.all().order_by('-criado_em')
    serializer_class = EntregaSerializer