# backend/fleet/models.py
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