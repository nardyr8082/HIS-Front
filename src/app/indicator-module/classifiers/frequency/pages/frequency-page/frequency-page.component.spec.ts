import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyPageComponent } from './frequency-page.component';

describe('FrequencyPageComponent', () => {
  let component: FrequencyPageComponent;
  let fixture: ComponentFixture<FrequencyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequencyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
