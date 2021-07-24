import { TestBed } from '@angular/core/testing';

import { WarehouseReceivedTransferService } from './warehouse-received-transfer.service';

describe('WarehouseReceivedTransferService', () => {
  let service: WarehouseReceivedTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseReceivedTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
