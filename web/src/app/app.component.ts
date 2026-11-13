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

  constructor() {
    this.restaurarDadosUsuario();
  }

  aoConfirmarDados(dados: DadosUsuarioEmergencia): void {
    this.dadosUsuario = dados;
    // Após preencher o formulário, redireciona para a aba de abrigos
    this.telaAtual.set('abrigos'); 
  }

  editarLocal(): void {
    this.dadosUsuario = undefined;
    localStorage.removeItem('narota_dados_emergencia');
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

  private restaurarDadosUsuario(): void {
    const dadosSalvos = localStorage.getItem('narota_dados_emergencia');
    if (!dadosSalvos) {
      return;
    }

    try {
      const dados = JSON.parse(dadosSalvos) as DadosUsuarioEmergencia;
      if (
        typeof dados?.endereco !== 'string' ||
        typeof dados.quantidadePessoas !== 'number' ||
        typeof dados.temPrioridade !== 'boolean' ||
        typeof dados.usouGps !== 'boolean'
      ) {
        throw new Error('Formato inválido');
      }

      this.dadosUsuario = dados;
    } catch (error) {
      console.error('Não foi possível restaurar os dados de emergência salvos.', error);
      localStorage.removeItem('narota_dados_emergencia');
    }
  }
}