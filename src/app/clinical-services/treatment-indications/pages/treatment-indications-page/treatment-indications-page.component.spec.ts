import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentIndicationsPageComponent } from './treatment-indications-page.component';

describe('TreatmentIndicationsPageComponent', () => {
  let component: TreatmentIndicationsPageComponent;
  let fixture: ComponentFixture<TreatmentIndicationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentIndicationsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentIndicationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
