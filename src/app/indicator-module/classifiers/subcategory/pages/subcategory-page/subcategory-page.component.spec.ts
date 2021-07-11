import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryPageComponent } from './subcategory-page.component';

describe('SubcategoryPageComponent', () => {
  let component: SubcategoryPageComponent;
  let fixture: ComponentFixture<SubcategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubcategoryPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
