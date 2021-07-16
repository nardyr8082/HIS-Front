import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableIndicatorPageComponent } from './variable-indicator-page.component';

describe('VaribleIndicatorPageComponent', () => {
  let component: VariableIndicatorPageComponent;
  let fixture: ComponentFixture<VariableIndicatorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariableIndicatorPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableIndicatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
