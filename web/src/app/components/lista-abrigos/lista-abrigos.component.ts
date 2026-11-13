import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasRiscoService, AvisoMeteorologico } from '../../services/areas-risco.service';

export interface Abrigo {
  id: number;
  nome: string;
  tipo?: string;
  endereco: string;
  bairro: string;
  municipio: string;
  vagasDisponiveis?: number;
  capacidadeTotal?: number;
  status: 'ABERTO' | 'LOTADO';
  temAcessibilidadePcd: boolean;
  coordenadas?: { lat: number; lng: number };
  distanciaKm?: number;
  telefoneContato: string;
}

@Component({
  selector: 'app-lista-abrigos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-abrigos.component.html',
  styleUrl: './lista-abrigos.component.css'
})
export class ListaAbrigosComponent implements OnInit {
  private readonly areasRiscoService = inject(AreasRiscoService);
  @Input() enderecoUsuario: string = '';
  @Input() coordenadasUsuario?: { lat: number; lng: number };
  @Input() quantidadePessoas: number = 1;
  @Input() temPrioridade: boolean = false;

  abrigos = signal<Abrigo[]>([
    { id: 1, nome: 'Abrigo Emergencial do Gusmão', endereco: 'Travessa do Gusmão, 178, próximo à Praça Sérgio Loreto', bairro: 'São José', municipio: 'Recife', vagasDisponiveis: 45, status: 'ABERTO', temAcessibilidadePcd: true, telefoneContato: '08000813400' },
    { id: 3, nome: 'Centro POP Glória', tipo: 'Ponto de encaminhamento', endereco: 'Rua Bernardo Guimarães, 135, próximo à Unicap', bairro: 'Santo Amaro', municipio: 'Recife', vagasDisponiveis: 80, status: 'ABERTO', temAcessibilidadePcd: true, telefoneContato: '8132224840' },
    { id: 4, nome: 'Centro POP Neuza Gomes', tipo: 'Ponto de encaminhamento', endereco: 'Rua Dr. João Coimbra, 66, próximo ao Mercado da Madalena', bairro: 'Madalena', municipio: 'Recife', vagasDisponiveis: 20, status: 'ABERTO', temAcessibilidadePcd: true, telefoneContato: '8133011828' }
  ]);

  filtroAtivo = signal<string>('todos');
  avisoMeteorologico = signal<AvisoMeteorologico | null>(null);
  erroAvisoMeteorologico = signal('');

  ngOnInit(): void {
    this.areasRiscoService.buscarAvisoMeteorologico(this.enderecoUsuario, this.coordenadasUsuario).subscribe({
      next: aviso => this.avisoMeteorologico.set(aviso),
      error: error => {
        console.error('Não foi possível consultar a previsão meteorológica.', error);
        this.erroAvisoMeteorologico.set('Não foi possível consultar a previsão meteorológica agora.');
      }
    });
  }

  filtrar(status: string): void {
    this.filtroAtivo.set(status);
  }

  obterUrlMapa(abrigo: Abrigo): string {
    if (abrigo.coordenadas) {
      const { lat, lng } = abrigo.coordenadas;
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    const localizacao = `${abrigo.nome}, ${abrigo.endereco}, ${abrigo.municipio}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localizacao)}`;
  }

  get abrigosFiltrados() {
    const status = this.filtroAtivo();
    if (status === 'todos') return this.abrigos();
    return this.abrigos().filter(a => a.status === status.toUpperCase());
  }
}