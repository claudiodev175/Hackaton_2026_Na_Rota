import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ListaAbrigosComponent } from './lista-abrigos.component';

describe('ListaAbrigosComponent', () => {
  let component: ListaAbrigosComponent;
  let fixture: ComponentFixture<ListaAbrigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAbrigosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
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
      'https://www.google.com/maps/search/?api=1&query=Abrigo%20Emergencial%20do%20Gusm%C3%A3o%2C%20Travessa%20do%20Gusm%C3%A3o%2C%20178%2C%20pr%C3%B3ximo%20%C3%A0%20Pra%C3%A7a%20S%C3%A9rgio%20Loreto%2C%20Recife'
    );
  });

  it('should search by name when a shelter has no confirmed coordinates', () => {
    const abrigo = component.abrigos()[1];

    expect(component.obterUrlMapa(abrigo)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Centro%20POP%20Gl%C3%B3ria%2C%20Rua%20Bernardo%20Guimar%C3%A3es%2C%20135%2C%20pr%C3%B3ximo%20%C3%A0%20Unicap%2C%20Recife'
    );
  });
});
