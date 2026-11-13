import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LOCALIDADES_RMR } from '../../data/rmr-localidades';

export interface DadosUsuarioEmergencia {
  endereco: string;
  quantidadePessoas: number;
  temPrioridade: boolean;
  usouGps: boolean;
  coordenadas?: { lat: number; lng: number };
}

@Component({
  selector: 'app-inicio-rapido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-rapido.component.html',
  styleUrl: './inicio-rapido.component.css'
})
export class InicioRapidoComponent {
  @Output() dadosConfirmados = new EventEmitter<DadosUsuarioEmergencia>();

  // Base completa dos 14 municípios da RMR
  bairrosDisponiveis = LOCALIDADES_RMR;

  // Estados reativos (Signals)
  endereco = signal<string>('');
  quantidadePessoas = signal<number>(1);
  temPrioridade = signal<boolean>(false);
  carregandoGps = signal<boolean>(false);
  mensagemStatus = signal<string>('');
  erroGps = signal<boolean>(false);
  usouGps = signal<boolean>(false);
  coordenadas?: { lat: number; lng: number };

  alterarQuantidade(delta: number): void {
    const novoValor = this.quantidadePessoas() + delta;
    if (novoValor >= 1 && novoValor <= 30) {
      this.quantidadePessoas.set(novoValor);
    }
  }

  usarLocalizacaoAtual(): void {
    this.erroGps.set(false);
    this.mensagemStatus.set('Buscando sua localização...');

    if (!navigator.geolocation) {
      this.erroGps.set(true);
      this.mensagemStatus.set('Seu celular não suporta GPS. Digite seu bairro abaixo.');
      return;
    }

    this.carregandoGps.set(true);

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        this.carregandoGps.set(false);
        this.usouGps.set(true);
        this.coordenadas = {
          lat: posicao.coords.latitude,
          lng: posicao.coords.longitude
        };
        this.endereco.set('Localização atual (GPS ativo)');
        this.mensagemStatus.set('✅ Localização encontrada! Agora confirme quantas pessoas estão com você.');
      },
      () => {
        this.carregandoGps.set(false);
        this.erroGps.set(true);
        this.mensagemStatus.set('⚠️ Sinal de GPS fraco. Digite seu bairro ou município abaixo.');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }

  confirmarEVerAbrigos(): void {
    const enderecoFinal = this.endereco().trim() || 'Centro, Recife';

    const payload: DadosUsuarioEmergencia = {
      endereco: enderecoFinal,
      quantidadePessoas: this.quantidadePessoas(),
      temPrioridade: this.temPrioridade(),
      usouGps: this.usouGps(),
      coordenadas: this.coordenadas
    };

    try {
      localStorage.setItem('narota_dados_emergencia', JSON.stringify(payload));
    } catch {
    }

    this.dadosConfirmados.emit(payload);
  }

  pularParaAbrigos(): void {
    this.endereco.set('Centro, Recife');
    this.confirmarEVerAbrigos();
  }
}