import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductstockFormComponent } from './productstock-form.component';



describe('ProductstockFormComponent', () => {
  let component: ProductstockFormComponent;
  let fixture: ComponentFixture<ProductstockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductstockFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductstockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
