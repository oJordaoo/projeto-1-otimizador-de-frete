# backend/config/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Endpoints de Autenticação
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Inclui as rotas dos nossos apps de domínio
    path('api/', include('users.urls')),
    path('api/fleet/', include('fleet.urls')),
    path('api/logistics/', include('logistics.urls')),
    path('api/optimization/', include('optimization.urls')), # <-- ADICIONE ESTA LINHA
]