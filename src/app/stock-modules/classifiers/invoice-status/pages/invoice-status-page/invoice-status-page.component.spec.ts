import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStatusPageComponent } from './invoice-status-page.component';

describe('InvoiceStatusPageComponent', () => {
  let component: InvoiceStatusPageComponent;
  let fixture: ComponentFixture<InvoiceStatusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceStatusPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceStatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
