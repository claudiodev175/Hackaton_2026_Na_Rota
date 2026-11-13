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
});
