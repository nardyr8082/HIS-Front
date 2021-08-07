import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryStaticPinComponent } from './clinic-history-static-pin.component';

describe('ClinicHistoryStaticPinComponent', () => {
  let component: ClinicHistoryStaticPinComponent;
  let fixture: ComponentFixture<ClinicHistoryStaticPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHistoryStaticPinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHistoryStaticPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
