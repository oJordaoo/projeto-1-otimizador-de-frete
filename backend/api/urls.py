from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VeiculoViewSet, EntregaViewSet

router = DefaultRouter()
router.register(r'veiculos', VeiculoViewSet, basename='veiculo')
router.register(r'entregas', EntregaViewSet, basename='entrega')

urlpatterns = [
    path('', include(router.urls)),
]