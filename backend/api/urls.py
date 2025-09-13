from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VeiculoViewSet, EntregaViewSet, RegisterView, LeadCreateView

router = DefaultRouter()
router.register(r'veiculos', VeiculoViewSet, basename='veiculo')
router.register(r'entregas', EntregaViewSet, basename='entrega')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('leads/', LeadCreateView.as_view(), name='lead_create'),
]