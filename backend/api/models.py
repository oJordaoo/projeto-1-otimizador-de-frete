from django.db import models
import uuid

class Veiculo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    placa = models.CharField(max_length=10, unique=True)
    capacidade_kg = models.DecimalField(max_digits=10, decimal_places=2)
    capacidade_m3 = models.DecimalField(max_digits=10, decimal_places=2)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.placa

class Entrega(models.Model):
    class StatusEntrega(models.TextChoices):
        PENDENTE = 'PENDENTE', 'Pendente'
        EM_ROTA = 'EM_ROTA', 'Em Rota'
        ENTREGUE = 'ENTREGUE', 'Entregue'
        FALHOU = 'FALHOU', 'Falhou'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Campos de Endereço de Origem
    cep_origem = models.CharField(max_length=9, blank=True)
    endereco_origem = models.CharField(max_length=255, blank=True)
    cidade_origem = models.CharField(max_length=100, blank=True)
    estado_origem = models.CharField(max_length=2, blank=True)
    
    # Campos de Coordenadas de Origem (calculados pelo sistema)
    ponto_origem_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    ponto_origem_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    
    # Campos de Endereço de Destino
    cep_destino = models.CharField(max_length=9)
    endereco_destino = models.CharField(max_length=255)
    cidade_destino = models.CharField(max_length=100)
    estado_destino = models.CharField(max_length=2)

    # Campos de Coordenadas de Destino (calculados pelo sistema)
    ponto_destino_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    ponto_destino_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    # Campos da Carga
    peso_kg = models.DecimalField(max_digits=10, decimal_places=2)
    volume_m3 = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Campos de Status e Alocação
    status = models.CharField(
        max_length=10, 
        choices=StatusEntrega.choices, 
        default=StatusEntrega.PENDENTE
    )
    veiculo_alocado = models.ForeignKey(
        Veiculo, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='entregas'
    )
    
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Entrega {str(self.id)[:5]}..."