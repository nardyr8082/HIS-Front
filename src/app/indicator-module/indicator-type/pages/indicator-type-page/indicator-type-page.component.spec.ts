import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorTypePageComponent } from './indicator-type-page.component';

describe('IndicatorTypePageComponent', () => {
  let component: IndicatorTypePageComponent;
  let fixture: ComponentFixture<IndicatorTypePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorTypePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
