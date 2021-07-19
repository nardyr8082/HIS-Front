import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableIndicatorFormComponent } from './variable-indicator-form.component';

describe('VariableIndicadtorFormComponent', () => {
  let component: VariableIndicatorFormComponent;
  let fixture: ComponentFixture<VariableIndicatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariableIndicatorFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableIndicatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
