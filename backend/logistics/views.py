# backend/logistics/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Entrega
from .serializers import EntregaSerializer

class EntregaViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite aos usuários visualizar ou editar entregas.
    """
    queryset = Entrega.objects.all().order_by('-criado_em')
    serializer_class = EntregaSerializer
    permission_classes = [IsAuthenticated] # Protegido por autenticação