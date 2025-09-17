# backend/fleet/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VeiculoViewSet

# Cria um router para gerar as URLs de CRUD automaticamente
router = DefaultRouter()
router.register(r'vehicles', VeiculoViewSet, basename='veiculo')

urlpatterns = [
    path('', include(router.urls)),
]