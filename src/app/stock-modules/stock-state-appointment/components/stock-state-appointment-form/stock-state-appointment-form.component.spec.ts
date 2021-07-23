import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStateAppointmentFormComponent } from './stock-state-appointment-form.component';

describe('StockStateAppointmentFormComponent', () => {
  let component: StockStateAppointmentFormComponent;
  let fixture: ComponentFixture<StockStateAppointmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockStateAppointmentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockStateAppointmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
