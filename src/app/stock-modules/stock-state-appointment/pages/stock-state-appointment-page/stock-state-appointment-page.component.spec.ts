import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStateAppointmentPageComponent } from './stock-state-appointment-page.component';

describe('StockStateAppointmentPageComponent', () => {
  let component: StockStateAppointmentPageComponent;
  let fixture: ComponentFixture<StockStateAppointmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockStateAppointmentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockStateAppointmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
