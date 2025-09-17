# backend/optimization/urls.py
from django.urls import path
from .views import OtimizacaoView

urlpatterns = [
    path('run/', OtimizacaoView.as_view(), name='run_optimization'),
]