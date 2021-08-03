import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PinpacientePageComponent } from './pinpaciente-page.component';



describe('PinpacientePageComponent', () => {
  let component: PinpacientePageComponent;
  let fixture: ComponentFixture<PinpacientePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PinpacientePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinpacientePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
