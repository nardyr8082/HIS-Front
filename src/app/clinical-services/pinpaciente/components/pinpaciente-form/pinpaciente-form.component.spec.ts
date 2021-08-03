import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PinpacienteFormComponent } from './pinpaciente-form.component';





describe('PinpacienteFormComponent', () => {
  let component: PinpacienteFormComponent;
  let fixture: ComponentFixture<PinpacienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PinpacienteFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinpacienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
