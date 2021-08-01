import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentIndicationsFormComponent } from './treatment-indications-form.component';

describe('TreatmentIndicationsFormComponent', () => {
  let component: TreatmentIndicationsFormComponent;
  let fixture: ComponentFixture<TreatmentIndicationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentIndicationsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentIndicationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
