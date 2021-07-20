import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistenceFormComponent } from './existence-form.component';

describe('ExistenceFormComponent', () => {
  let component: ExistenceFormComponent;
  let fixture: ComponentFixture<ExistenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistenceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
