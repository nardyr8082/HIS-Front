import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFacturePageComponent } from './purchase-facture-page.component';

describe('PurchaseFacturePageComponent', () => {
  let component: PurchaseFacturePageComponent;
  let fixture: ComponentFixture<PurchaseFacturePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseFacturePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseFacturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
