import { TestBed } from '@angular/core/testing';

import { ClinicHistoryStaticService } from './clinic-history-static.service';

describe('ClinicHistoryStaticService', () => {
  let service: ClinicHistoryStaticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicHistoryStaticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
