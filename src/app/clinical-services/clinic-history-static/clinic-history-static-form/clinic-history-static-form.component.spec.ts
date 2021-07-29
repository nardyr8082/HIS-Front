import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryStaticFormComponent } from './clinic-history-static-form.component';

describe('ClinicHistoryStaticFormComponent', () => {
  let component: ClinicHistoryStaticFormComponent;
  let fixture: ComponentFixture<ClinicHistoryStaticFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHistoryStaticFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHistoryStaticFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
