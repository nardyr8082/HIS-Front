import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFamilyPageComponent } from './product-family-page.component';

describe('ProductFamilyPageComponent', () => {
  let component: ProductFamilyPageComponent;
  let fixture: ComponentFixture<ProductFamilyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductFamilyPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFamilyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
