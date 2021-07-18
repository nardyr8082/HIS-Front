import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyFormComponent } from './frequency-form.component';

describe('FrequencyFormComponent', () => {
  let component: FrequencyFormComponent;
  let fixture: ComponentFixture<FrequencyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequencyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
