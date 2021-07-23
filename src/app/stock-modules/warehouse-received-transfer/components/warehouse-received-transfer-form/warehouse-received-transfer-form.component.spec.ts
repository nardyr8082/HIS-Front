import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReceivedTransferFormComponent } from './warehouse-received-transfer-form.component';

describe('WarehouseReceivedTransferFormComponent', () => {
  let component: WarehouseReceivedTransferFormComponent;
  let fixture: ComponentFixture<WarehouseReceivedTransferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseReceivedTransferFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseReceivedTransferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
