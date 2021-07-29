import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemExamPageComponent } from './system-exam-page.component';

describe('SystemExamPageComponent', () => {
  let component: SystemExamPageComponent;
  let fixture: ComponentFixture<SystemExamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemExamPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemExamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
