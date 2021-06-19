import { TestBed } from '@angular/core/testing';

import { CivilStatusService } from './civil-status.service';

describe('CivilStatusService', () => {
  let service: CivilStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CivilStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
