import { TestBed } from '@angular/core/testing';

import { TreatmentExecutionsService } from './treatment-executions.service';

describe('TreatmentExecutionsService', () => {
  let service: TreatmentExecutionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatmentExecutionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
