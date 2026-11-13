import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioRapidoComponent, DadosUsuarioEmergencia } from './components/inicio-rapido/inicio-rapido.component';
import { TelaSosComponent } from './components/tela-sos/tela-sos.component';
import { ListaAbrigosComponent } from './components/lista-abrigos/lista-abrigos.component';
import { BottomNavComponent, AbaAtiva } from './components/bottom-nav/bottom-nav.component';
import { InstrucoesComponent } from './components/instrucoes/instrucoes.component';
import { ContatosComponent } from './components/contatos/contatos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    InicioRapidoComponent,
    TelaSosComponent,
    ListaAbrigosComponent,
    BottomNavComponent,
    InstrucoesComponent,
    ContatosComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  telaAtual = signal<AbaAtiva>('inicio');
  dadosUsuario?: DadosUsuarioEmergencia;

  aoConfirmarDados(dados: DadosUsuarioEmergencia): void {
    this.dadosUsuario = dados;
    // Após preencher o formulário, redireciona para a aba de abrigos
    this.telaAtual.set('abrigos'); 
  }

  irParaAbrigos(): void {
    this.telaAtual.set('abrigos');
  }

  voltarParaInicio(): void {
    this.telaAtual.set('inicio');
  }

  navegarPara(aba: AbaAtiva): void {
    this.telaAtual.set(aba);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}