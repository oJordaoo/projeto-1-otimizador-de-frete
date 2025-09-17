# backend/fleet/serializers.py
from rest_framework import serializers
from .models import Veiculo

class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veiculo
        fields = ['id', 'placa', 'capacidade_kg', 'capacidade_m3', 'criado_em', 'atualizado_em']