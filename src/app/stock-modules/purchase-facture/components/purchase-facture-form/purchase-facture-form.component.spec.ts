import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFactureFormComponent } from './purchase-facture-form.component';

describe('PurchaseFactureFormComponent', () => {
  let component: PurchaseFactureFormComponent;
  let fixture: ComponentFixture<PurchaseFactureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseFactureFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseFactureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
