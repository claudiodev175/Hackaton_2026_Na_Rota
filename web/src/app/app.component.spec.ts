import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { DadosUsuarioEmergencia } from './components/inicio-rapido/inicio-rapido.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    localStorage.removeItem('narota_dados_emergencia');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should start on the initial screen', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    expect(app.telaAtual()).toBe('identificacao');
    expect(fixture.nativeElement.querySelector('app-inicio-rapido')).toBeTruthy();
  });

  it('should keep the SOS tab available without allowing an empty SOS screen', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.navegarPara('sos');

    expect(app.telaAtual()).toBe('identificacao');
  });

  it('should complete the journey from identification to SOS, shelters and back', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const dados: DadosUsuarioEmergencia = {
      endereco: 'Boa Viagem, Recife',
      quantidadePessoas: 3,
      temPrioridade: true,
      usouGps: false
    };

    app.aoConfirmarDados(dados);
    fixture.detectChanges();
    expect(app.telaAtual()).toBe('sos');
    expect(fixture.nativeElement.querySelector('app-tela-sos')).toBeTruthy();

    app.irParaAbrigos();
    fixture.detectChanges();
    expect(app.telaAtual()).toBe('abrigos');
    expect(fixture.nativeElement.querySelector('app-lista-abrigos')).toBeTruthy();

    app.editarLocal();
    fixture.detectChanges();
    expect(app.telaAtual()).toBe('identificacao');
    expect(fixture.nativeElement.querySelector('app-inicio-rapido')).toBeTruthy();
  });
});
