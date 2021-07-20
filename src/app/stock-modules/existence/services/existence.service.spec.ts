import { TestBed } from '@angular/core/testing';

import { ExistenceService } from './existence.service';

describe('ExistenceService', () => {
  let service: ExistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
