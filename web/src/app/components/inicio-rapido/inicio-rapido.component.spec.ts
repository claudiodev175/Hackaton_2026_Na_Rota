import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioRapidoComponent } from './inicio-rapido.component';

describe('InicioRapidoComponent', () => {
  let component: InicioRapidoComponent;
  let fixture: ComponentFixture<InicioRapidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioRapidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the number of people between one and thirty', () => {
    component.alterarQuantidade(-1);
    expect(component.quantidadePessoas()).toBe(1);

    component.quantidadePessoas.set(30);
    component.alterarQuantidade(1);
    expect(component.quantidadePessoas()).toBe(30);
  });

  it('should emit the identification data submitted by the user', () => {
    component.endereco.set('Ibura, Recife');
    component.quantidadePessoas.set(4);
    component.temPrioridade.set(true);
    let dadosEmitidos: unknown;

    component.dadosConfirmados.subscribe(dados => dadosEmitidos = dados);
    component.confirmarEVerAbrigos();

    expect(dadosEmitidos).toEqual({
      endereco: 'Ibura, Recife',
      quantidadePessoas: 4,
      temPrioridade: true,
      usouGps: false,
      coordenadas: undefined
    });
  });
});
