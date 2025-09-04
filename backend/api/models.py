# backend/api/models.py

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
    ponto_origem_lat = models.DecimalField(max_digits=10, decimal_places=7)
    ponto_origem_lng = models.DecimalField(max_digits=10, decimal_places=7)
    ponto_destino_lat = models.DecimalField(max_digits=10, decimal_places=7)
    ponto_destino_lng = models.DecimalField(max_digits=10, decimal_places=7)
    peso_kg = models.DecimalField(max_digits=10, decimal_places=2)
    volume_m3 = models.DecimalField(max_digits=10, decimal_places=2)
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