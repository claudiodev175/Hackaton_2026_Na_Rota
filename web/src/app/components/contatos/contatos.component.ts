import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contatos.component.html',
  styleUrl: './contatos.component.css'
})
export class ContatosComponent {
  @Output() abrirAbrigos = new EventEmitter<void>();
}