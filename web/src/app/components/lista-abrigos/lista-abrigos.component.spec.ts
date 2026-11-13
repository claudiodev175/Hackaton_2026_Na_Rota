import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAbrigosComponent } from './lista-abrigos.component';

describe('ListaAbrigosComponent', () => {
  let component: ListaAbrigosComponent;
  let fixture: ComponentFixture<ListaAbrigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAbrigosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAbrigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should point to the selected shelter location when the map action is clicked', () => {
    const abrigo = component.abrigos()[0];

    expect(component.obterUrlMapa(abrigo)).toBe(
      'https://www.google.com/maps/search/?api=1&query=-8.1103175,-34.9238188'
    );
  });

  it('should search by name when a shelter has no confirmed coordinates', () => {
    const abrigo = component.abrigos()[1];

    expect(component.obterUrlMapa(abrigo)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Gin%C3%A1sio%20de%20Jardim%20S%C3%A3o%20Paulo%2C%20Jardim%20S%C3%A3o%20Paulo%2C%20Recife'
    );
  });
});
