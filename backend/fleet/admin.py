# backend/fleet/admin.py
from django.contrib import admin
from .models import Veiculo

@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'capacidade_kg', 'capacidade_m3', 'criado_em')
    search_fields = ('placa',)