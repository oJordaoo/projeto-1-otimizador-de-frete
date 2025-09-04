# backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VeiculoViewSet, EntregaViewSet

# Cria um router e registra nossos viewsets com ele.
router = DefaultRouter()
router.register(r'veiculos', VeiculoViewSet, basename='veiculo')
router.register(r'entregas', EntregaViewSet, basename='entrega')

# As URLs da API são determinadas automaticamente pelo router.
urlpatterns = [
    path('', include(router.urls)),
]