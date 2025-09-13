from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from .models import Veiculo, Entrega, Lead
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": _("Nenhuma conta ativa foi encontrada com as credenciais fornecidas")
    }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        user_identifier = attrs.get(self.username_field)
        User = get_user_model()
        try:
            user = User.objects.get(email=user_identifier)
            attrs[self.username_field] = user.get_username()
        except User.DoesNotExist:
            pass
        return super().validate(attrs)

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'], 
            validated_data['email'], 
            validated_data['password']
        )
        return user

class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veiculo
        fields = ['id', 'placa', 'capacidade_kg', 'capacidade_m3', 'criado_em', 'atualizado_em']

class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = [
            'id', 'cep_origem', 'endereco_origem', 'cidade_origem', 'estado_origem',
            'ponto_origem_lat', 'ponto_origem_lng', 'cep_destino', 'endereco_destino', 
            'cidade_destino', 'estado_destino', 'ponto_destino_lat', 'ponto_destino_lng',
            'peso_kg', 'altura_m', 'largura_m', 'comprimento_m', 'volume_m3', 
            'status', 'veiculo_alocado', 'criado_em', 'atualizado_em'
        ]
        read_only_fields = [
            'ponto_origem_lat', 'ponto_origem_lng', 
            'ponto_destino_lat', 'ponto_destino_lng'
        ]

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ('nome_completo', 'email', 'telefone')