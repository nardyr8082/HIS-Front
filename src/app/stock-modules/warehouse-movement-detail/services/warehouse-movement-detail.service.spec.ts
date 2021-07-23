import { TestBed } from '@angular/core/testing';

import { WarehouseMovementDetailService } from './warehouse-movement-detail.service';

describe('WarehouseMovementDetailService', () => {
  let service: WarehouseMovementDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseMovementDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
