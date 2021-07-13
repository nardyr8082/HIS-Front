import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorTypeFormComponent } from './indicator-type-form.component';

describe('IndicatorTypeFormComponent', () => {
  let component: IndicatorTypeFormComponent;
  let fixture: ComponentFixture<IndicatorTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
