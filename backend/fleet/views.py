# backend/fleet/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Veiculo
from .serializers import VeiculoSerializer

class VeiculoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite aos usuários visualizar ou editar veículos.
    """
    queryset = Veiculo.objects.all().order_by('-criado_em')
    serializer_class = VeiculoSerializer
    permission_classes = [IsAuthenticated] # SÓ USUÁRIOS LOGADOS PODEM ACESSAR