import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PricechangesFormComponent } from './pricechanges-form.component';

describe('PricechangesFormComponent', () => {
  let component: PricechangesFormComponent;
  let fixture: ComponentFixture<PricechangesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PricechangesFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricechangesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
