from django.db import models
from fleet.models import Veiculo
import uuid
import requests

class Entrega(models.Model):
    class StatusEntrega(models.TextChoices):
        PENDENTE = 'PENDENTE', 'Pendente'
        EM_ROTA = 'EM_ROTA', 'Em Rota'
        ENTREGUE = 'ENTREGUE', 'Entregue'
        FALHOU = 'FALHOU', 'Falhou'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Origem
    endereco_origem = models.CharField(max_length=255)
    cidade_origem = models.CharField(max_length=100)
    estado_origem = models.CharField(max_length=2, default='PR')
    cep_origem = models.CharField(max_length=9)
    ponto_origem_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    ponto_origem_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    
    # Destino
    endereco_destino = models.CharField(max_length=255)
    cidade_destino = models.CharField(max_length=100)
    estado_destino = models.CharField(max_length=2, default='SP')
    cep_destino = models.CharField(max_length=9)
    ponto_destino_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    ponto_destino_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    route_geometry = models.JSONField(null=True, blank=True)
    
    peso_kg = models.DecimalField(max_digits=10, decimal_places=2)
    volume_m3 = models.DecimalField(max_digits=10, decimal_places=3)
    
    status = models.CharField(max_length=10, choices=StatusEntrega.choices, default=StatusEntrega.PENDENTE)
    veiculo_alocado = models.ForeignKey(Veiculo, on_delete=models.SET_NULL, null=True, blank=True, related_name='entregas')
    
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Entrega {self.id} - {self.status}"

    def get_coords_for_address(self, cep):
        try:
            # Simulação robusta de coordenadas
            cep_numerico = int(cep.replace('-', ''))
            if 80000000 <= cep_numerico <= 82999999: # Faixa de CEP de Curitiba
                return '-25.4284', '-49.2733'
            if 1000000 <= cep_numerico <= 5999999: # Faixa de CEP de São Paulo
                return '-23.5505', '-46.6333'
            return None, None
        except (ValueError, TypeError):
            return None, None

    def get_route_from_osrm(self, start_coords, end_coords):
        lng_origem, lat_origem = start_coords
        lng_destino, lat_destino = end_coords
        url = f"http://router.project-osrm.org/route/v1/driving/{lng_origem},{lat_origem};{lng_destino},{lat_destino}?overview=full&geometries=geojson"
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            route = data['routes'][0]['geometry']['coordinates']
            return [[coord[1], coord[0]] for coord in route]
        except requests.RequestException:
            return [[float(lat_origem), float(lng_origem)], [float(lat_destino), float(lng_destino)]]

    def save(self, *args, **kwargs):
        # Geocodifica a origem
        lat_o, lng_o = self.get_coords_for_address(self.cep_origem)
        self.ponto_origem_lat = lat_o
        self.ponto_origem_lng = lng_o
        
        # Geocodifica o destino
        lat_d, lng_d = self.get_coords_for_address(self.cep_destino)
        self.ponto_destino_lat = lat_d
        self.ponto_destino_lng = lng_d

        # Se tivermos as duas coordenadas, calcula e salva a rota
        if self.ponto_origem_lng and self.ponto_destino_lng:
            origem_coords = (self.ponto_origem_lng, self.ponto_origem_lat)
            destino_coords = (self.ponto_destino_lng, self.ponto_destino_lat)
            self.route_geometry = self.get_route_from_osrm(origem_coords, destino_coords)
            
        super().save(*args, **kwargs)