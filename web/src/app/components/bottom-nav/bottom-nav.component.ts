import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AbaAtiva = 'inicio' | 'abrigos' | 'identificacao' | 'contatos' | 'instrucoes' | 'sos';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  @Input({ required: true }) abaAtual!: AbaAtiva;
  @Output() mudarAba = new EventEmitter<AbaAtiva>();

  selecionar(aba: AbaAtiva): void {
    this.mudarAba.emit(aba);
  }
}