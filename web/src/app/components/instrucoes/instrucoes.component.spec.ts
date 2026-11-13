import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrucoesComponent } from './instrucoes.component';

describe('InstrucoesComponent', () => {
  let component: InstrucoesComponent;
  let fixture: ComponentFixture<InstrucoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrucoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrucoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
