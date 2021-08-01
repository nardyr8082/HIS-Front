import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentExecutionsFormComponent } from './treatment-executions-form.component';

describe('TreatmentExecutionsFormComponent', () => {
  let component: TreatmentExecutionsFormComponent;
  let fixture: ComponentFixture<TreatmentExecutionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentExecutionsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentExecutionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
