# backend/api/serializers.py

from rest_framework import serializers
from .models import Veiculo, Entrega

class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veiculo
        fields = [
            'id', 
            'placa', 
            'capacidade_kg', 
            'capacidade_m3', 
            'criado_em', 
            'atualizado_em'
        ]

class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = [
            'id',
            'ponto_origem_lat',
            'ponto_origem_lng',
            'ponto_destino_lat',
            'ponto_destino_lng',
            'peso_kg',
            'volume_m3',
            'status',
            'veiculo_alocado',
            'criado_em',
            'atualizado_em'
        ]