import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthUnitFormComponent } from './health-unit-form.component';

describe('HealtUnitFormComponent', () => {
  let component: HealthUnitFormComponent;
  let fixture: ComponentFixture<HealthUnitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthUnitFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
