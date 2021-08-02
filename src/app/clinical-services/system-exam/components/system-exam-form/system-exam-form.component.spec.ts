import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemExamFormComponent } from './system-exam-form.component';

describe('SystemExamFormComponent', () => {
  let component: SystemExamFormComponent;
  let fixture: ComponentFixture<SystemExamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemExamFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemExamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
