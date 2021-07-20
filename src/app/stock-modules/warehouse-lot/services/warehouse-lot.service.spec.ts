import { TestBed } from '@angular/core/testing';

import { WarehouseLotService } from './warehouse-lot.service';

describe('WarehouseLotService', () => {
  let service: WarehouseLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
