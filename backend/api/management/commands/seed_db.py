import random
from django.core.management.base import BaseCommand
from django.db import transaction
from faker import Faker
from api.models import Veiculo, Entrega

class Command(BaseCommand):
    help = 'Limpa e popula o banco de dados com dados falsos para teste.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("Limpando dados antigos do banco de dados...")
        Veiculo.objects.all().delete()
        Entrega.objects.all().delete()

        fake = Faker('pt_BR')
        
        self.stdout.write("Criando 5 veículos...")
        placas_letras = ['ABC', 'BRA', 'XYZ', 'DEF', 'GHI']
        veiculos = []
        for i in range(5):
            veiculo = Veiculo.objects.create(
                placa=f'{random.choice(placas_letras)}{random.randint(1000, 9999)}',
                capacidade_kg=random.choice([500, 1000, 1500, 2000]),
                capacidade_m3=random.choice([3, 5, 8, 12])
            )
            veiculos.append(veiculo)

        self.stdout.write("Criando 200 entregas com endereços...")
        entregas_a_criar = []
        for _ in range(200):
            entrega = Entrega(
                # Dados de Endereço Fake (agora usando Faker para endereços)
                cep_destino=fake.postcode(),
                endereco_destino=fake.street_address(),
                cidade_destino=fake.city(),
                estado_destino=fake.state_abbr(),
                
                # Dados da Carga
                peso_kg=round(random.uniform(5.0, 150.0), 2),
                volume_m3=round(random.uniform(0.1, 1.5), 2)
            )
            entregas_a_criar.append(entrega)
        
        Entrega.objects.bulk_create(entregas_a_criar)
        
        self.stdout.write(self.style.SUCCESS(f"\nBanco de dados populado com sucesso!"))
        self.stdout.write(self.style.SUCCESS(f"-> {len(veiculos)} veículos criados."))
        self.stdout.write(self.style.SUCCESS(f"-> {len(entregas_a_criar)} entregas criadas."))