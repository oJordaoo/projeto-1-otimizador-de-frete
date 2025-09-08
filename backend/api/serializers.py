from rest_framework import serializers
from .models import Veiculo, Entrega
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        user_identifier = attrs.get(self.username_field)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(email=user_identifier)
            attrs[self.username_field] = user.get_username()
        except User.DoesNotExist:
            pass
        return super().validate(attrs)


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
            'cep_origem', 'endereco_origem', 'cidade_origem', 'estado_origem',
            'ponto_origem_lat', 'ponto_origem_lng',
            'cep_destino', 'endereco_destino', 'cidade_destino', 'estado_destino',
            'ponto_destino_lat', 'ponto_destino_lng',
            'peso_kg', 'volume_m3', 'status', 'veiculo_alocado', 
            'criado_em', 'atualizado_em'
        ]
        read_only_fields = [
            'ponto_origem_lat', 'ponto_origem_lng', 
            'ponto_destino_lat', 'ponto_destino_lng'
        ]