import { TestBed } from '@angular/core/testing';

import { WarehouseInventoryDifferenceService } from './warehouse-inventory-difference.service';

describe('WarehouseInventoryDifferenceService', () => {
  let service: WarehouseInventoryDifferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseInventoryDifferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
