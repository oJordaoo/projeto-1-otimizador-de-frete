# backend/logistics/admin.py
from django.contrib import admin
from .models import Entrega

@admin.register(Entrega)
class EntregaAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'cidade_destino', 'veiculo_alocado', 'peso_kg', 'criado_em')
    list_filter = ('status', 'veiculo_alocado')
    search_fields = ('id', 'cidade_destino')