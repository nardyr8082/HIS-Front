import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealtUnitFormComponent } from './healt-unit-form.component';

describe('HealtUnitFormComponent', () => {
  let component: HealtUnitFormComponent;
  let fixture: ComponentFixture<HealtUnitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealtUnitFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealtUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
