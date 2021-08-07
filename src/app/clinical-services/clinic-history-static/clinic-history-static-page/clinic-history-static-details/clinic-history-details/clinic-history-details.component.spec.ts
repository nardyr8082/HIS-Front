import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryDetailsComponent } from './clinic-history-details.component';

describe('ClinicHistoryDetailsComponent', () => {
  let component: ClinicHistoryDetailsComponent;
  let fixture: ComponentFixture<ClinicHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHistoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
