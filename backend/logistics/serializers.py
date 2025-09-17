# backend/logistics/serializers.py
from rest_framework import serializers
from .models import Entrega

class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = '__all__' # Inclui todos os campos do modelo