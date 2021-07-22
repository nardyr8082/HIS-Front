import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubprogramFormComponent } from './subprogram-form.component';

describe('SubprogramFormComponent', () => {
  let component: SubprogramFormComponent;
  let fixture: ComponentFixture<SubprogramFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubprogramFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubprogramFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
