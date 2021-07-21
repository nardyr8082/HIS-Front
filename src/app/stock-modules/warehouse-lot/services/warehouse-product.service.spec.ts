import { TestBed } from '@angular/core/testing';

import { WarehouseProductService } from './warehouse-product.service';

describe('WarehouseProductService', () => {
  let service: WarehouseProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
