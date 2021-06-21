import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthUnitPageComponent } from './health-unit-page.component';

describe('HealthUnitPageComponent', () => {
  let component: HealthUnitPageComponent;
  let fixture: ComponentFixture<HealthUnitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthUnitPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthUnitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
