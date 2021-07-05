import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodTypePageComponent } from './blood-type-page.component';

describe('MunicipalityPageComponent', () => {
  let component: BloodTypePageComponent;
  let fixture: ComponentFixture<BloodTypePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodTypePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
