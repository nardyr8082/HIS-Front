import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductstockPageComponent } from './productstock-page.component';



describe('ProductstockPageComponent', () => {
  let component: ProductstockPageComponent;
  let fixture: ComponentFixture<ProductstockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductstockPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductstockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
