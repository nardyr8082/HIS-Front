import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStatusFormComponent } from './invoice-status-form.component';

describe('InvoiceStatusFormComponent', () => {
  let component: InvoiceStatusFormComponent;
  let fixture: ComponentFixture<InvoiceStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceStatusFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
