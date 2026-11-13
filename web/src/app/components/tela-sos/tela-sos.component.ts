import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DadosUsuarioEmergencia } from '../inicio-rapido/inicio-rapido.component';

@Component({
  selector: 'app-tela-sos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tela-sos.component.html',
  styleUrl: './tela-sos.component.css'
})
export class TelaSosComponent {
  @Input() dadosUsuario?: DadosUsuarioEmergencia;
  @Output() abrirAbrigos = new EventEmitter<void>();
  @Output() editarLocal = new EventEmitter<void>();

  sosAcionado = signal<boolean>(false);
  copiadoComSucesso = signal<boolean>(false);

  acionarSos(): void {
    this.sosAcionado.set(true);
    // Vibração tátil no celular em caso de emergência
    if ('vibrate' in navigator) {
      navigator.vibrate([300, 100, 300]);
    }
  }

  cancelarSos(): void {
    this.sosAcionado.set(false);
    this.copiadoComSucesso.set(false);
  }

  copiarDadosEmergencia(): void {
    const local = this.dadosUsuario?.endereco || 'Local não informado';
    const pessoas = this.dadosUsuario?.quantidadePessoas || 1;
    const prioridade = this.dadosUsuario?.temPrioridade ? 'SIM (Idoso/Criança/PCD)' : 'Não';
    const coords = this.dadosUsuario?.coordenadas
      ? ` | GPS: ${this.dadosUsuario.coordenadas.lat.toFixed(5)}, ${this.dadosUsuario.coordenadas.lng.toFixed(5)}`
      : '';

    const texto = `PEDIDO DE S.O.S - APP NA ROTA\nLocal: ${local}${coords}\nPessoas na casa: ${pessoas}\nGrupo prioritário: ${prioridade}\nPreciso de orientação ou resgate urgente!`;

    navigator.clipboard.writeText(texto).then(() => {
      this.copiadoComSucesso.set(true);
      setTimeout(() => this.copiadoComSucesso.set(false), 4000);
    });
  }
}