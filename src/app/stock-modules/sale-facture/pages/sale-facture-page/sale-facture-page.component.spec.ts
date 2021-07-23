import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleFacturePageComponent } from './sale-facture-page.component';

describe('SaleFacturePageComponent', () => {
  let component: SaleFacturePageComponent;
  let fixture: ComponentFixture<SaleFacturePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleFacturePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleFacturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
