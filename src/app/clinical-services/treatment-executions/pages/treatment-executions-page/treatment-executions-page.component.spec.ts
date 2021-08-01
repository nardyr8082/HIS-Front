import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentExecutionsPageComponent } from './treatment-executions-page.component';

describe('TreatmentExecutionsPageComponent', () => {
  let component: TreatmentExecutionsPageComponent;
  let fixture: ComponentFixture<TreatmentExecutionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentExecutionsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentExecutionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
