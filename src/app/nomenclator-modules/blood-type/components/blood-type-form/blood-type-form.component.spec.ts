import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodTypeFormComponent } from './blood-type-form.component';

describe('MunicipalityFormComponent', () => {
  let component: BloodTypeFormComponent;
  let fixture: ComponentFixture<BloodTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodTypeFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
