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

  it('should show emergency channels after the SOS button is pressed', () => {
    component.acionarSos();
    fixture.detectChanges();

    expect(component.sosAcionado()).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Defesa Civil (199)');
    expect(fixture.nativeElement.textContent).toContain('Bombeiros (193)');
  });

  it('should return to the SOS button when the emergency panel is cancelled', () => {
    component.acionarSos();
    component.cancelarSos();

    expect(component.sosAcionado()).toBeFalse();
  });
});
