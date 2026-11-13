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
});
