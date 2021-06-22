import { TestBed } from '@angular/core/testing';

import { HealtUnitService } from './health-unit.service';

describe('HealtUnitService', () => {
  let service: HealtUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealtUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
