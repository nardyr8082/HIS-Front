import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilStatusFormComponent } from './civil-status-form.component';

describe('CivilStatusFormComponent', () => {
  let component: CivilStatusFormComponent;
  let fixture: ComponentFixture<CivilStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CivilStatusFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
