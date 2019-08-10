import { TestBed } from '@angular/core/testing';

import { ConstUrlService } from './const-url.service';

describe('ConstUrlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConstUrlService = TestBed.get(ConstUrlService);
    expect(service).toBeTruthy();
  });
});
