import { TestBed } from '@angular/core/testing';

import { ClinicalSectionService } from './clinical-section.service';

describe('ClinicalSectionService', () => {
  let service: ClinicalSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicalSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
