import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleFactureFormComponent } from './sale-facture-form.component';

describe('SaleFactureFormComponent', () => {
  let component: SaleFactureFormComponent;
  let fixture: ComponentFixture<SaleFactureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleFactureFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleFactureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
