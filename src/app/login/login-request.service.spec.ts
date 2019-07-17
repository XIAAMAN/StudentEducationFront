import { TestBed } from '@angular/core/testing';

import { LoginRequestService } from './login-request.service';

describe('LoginRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginRequestService = TestBed.get(LoginRequestService);
    expect(service).toBeTruthy();
  });
});
