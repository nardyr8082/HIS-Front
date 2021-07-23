import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReceivedTransferPageComponent } from './warehouse-received-transfer-page.component';

describe('WarehouseReceivedTransferPageComponent', () => {
  let component: WarehouseReceivedTransferPageComponent;
  let fixture: ComponentFixture<WarehouseReceivedTransferPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseReceivedTransferPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseReceivedTransferPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
