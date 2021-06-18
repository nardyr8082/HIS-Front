import { TestBed } from '@angular/core/testing';

import { CatDocentService } from './cat-docent.service';

describe('CatDocentService', () => {
  let service: CatDocentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatDocentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
