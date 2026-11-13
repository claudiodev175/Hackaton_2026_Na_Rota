import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaSosComponent } from './tela-sos.component';

describe('TelaSosComponent', () => {
  let component: TelaSosComponent;
  let fixture: ComponentFixture<TelaSosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaSosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaSosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
