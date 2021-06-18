import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatScienceFormComponent } from './cat-science-form.component';

describe('CatScienceFormComponent', () => {
  let component: CatScienceFormComponent;
  let fixture: ComponentFixture<CatScienceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatScienceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatScienceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
