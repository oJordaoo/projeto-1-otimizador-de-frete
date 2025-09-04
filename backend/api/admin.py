# backend/api/admin.py

from django.contrib import admin
from .models import Veiculo, Entrega

@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'capacidade_kg', 'capacidade_m3', 'criado_em')
    search_fields = ('placa',)

@admin.register(Entrega)
class EntregaAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'veiculo_alocado', 'peso_kg', 'criado_em')
    list_filter = ('status', 'veiculo_alocado')
    search_fields = ('id',)