import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PricechangesPageComponent } from './pricechanges-page.component';


describe('PricechangesPageComponent', () => {
  let component: PricechangesPageComponent;
  let fixture: ComponentFixture<PricechangesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PricechangesPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricechangesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
