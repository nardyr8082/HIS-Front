import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryFormComponent } from './clinic-history-form.component';

describe('ClinicHistoryFormComponent', () => {
  let component: ClinicHistoryFormComponent;
  let fixture: ComponentFixture<ClinicHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHistoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
