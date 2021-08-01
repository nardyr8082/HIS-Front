import { TestBed } from '@angular/core/testing';

import { TreatmentIndicationsService } from './treatment-indications.service';

describe('TreatmentIndicationsService', () => {
  let service: TreatmentIndicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatmentIndicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
