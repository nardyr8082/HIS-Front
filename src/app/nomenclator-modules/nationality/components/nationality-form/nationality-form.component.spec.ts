import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityFormComponent } from './nationality-form.component';

describe('NationalityFormComponent', () => {
  let component: NationalityFormComponent;
  let fixture: ComponentFixture<NationalityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalityFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
