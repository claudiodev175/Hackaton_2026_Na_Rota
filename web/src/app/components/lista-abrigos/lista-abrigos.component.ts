import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Abrigo {
  id: number;
  nome: string;
  bairro: string;
  municipio: string;
  vagasDisponiveis: number;
  capacidadeTotal: number;
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
export class ListaAbrigosComponent {
  @Input() enderecoUsuario: string = '';
  @Input() quantidadePessoas: number = 1;
  @Input() temPrioridade: boolean = false;

  abrigos = signal<Abrigo[]>([
    { id: 1, nome: 'Escola Municipal Paulo Freire', bairro: 'Ibura', municipio: 'Recife', vagasDisponiveis: 45, capacidadeTotal: 100, status: 'ABERTO', temAcessibilidadePcd: true, coordenadas: { lat: -8.1103175, lng: -34.9238188 }, distanciaKm: 1.2, telefoneContato: '81988887777' },
    { id: 2, nome: 'Ginásio de Jardim São Paulo', bairro: 'Jardim São Paulo', municipio: 'Recife', vagasDisponiveis: 12, capacidadeTotal: 150, status: 'ABERTO', temAcessibilidadePcd: true, distanciaKm: 3.5, telefoneContato: '81988886666' },
    { id: 3, nome: 'Compaz Alto Santa Terezinha', bairro: 'Alto Sta. Terezinha', municipio: 'Recife', vagasDisponiveis: 80, capacidadeTotal: 200, status: 'ABERTO', temAcessibilidadePcd: true, coordenadas: { lat: -8.0102102, lng: -34.9028734 }, distanciaKm: 4.8, telefoneContato: '81988885555' },
    { id: 4, nome: 'Colégio Estadual de Olinda', bairro: 'Bultrins', municipio: 'Olinda', vagasDisponiveis: 0, capacidadeTotal: 90, status: 'LOTADO', temAcessibilidadePcd: false, coordenadas: { lat: -8.0147034, lng: -34.8513956 }, distanciaKm: 6.1, telefoneContato: '81988884444' }
  ]);

  filtroAtivo = signal<string>('todos');

  filtrar(status: string): void {
    this.filtroAtivo.set(status);
  }

  obterUrlMapa(abrigo: Abrigo): string {
    if (abrigo.coordenadas) {
      const { lat, lng } = abrigo.coordenadas;
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    const localizacao = `${abrigo.nome}, ${abrigo.bairro}, ${abrigo.municipio}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localizacao)}`;
  }

  get abrigosFiltrados() {
    const status = this.filtroAtivo();
    if (status === 'todos') return this.abrigos();
    return this.abrigos().filter(a => a.status === status.toUpperCase());
  }
}