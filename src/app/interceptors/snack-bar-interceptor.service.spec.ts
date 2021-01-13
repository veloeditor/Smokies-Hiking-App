import { TestBed } from '@angular/core/testing';

import { SnackBarInterceptorService } from './snack-bar-interceptor.service';

describe('SnackBarInterceptorService', () => {
  let service: SnackBarInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackBarInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
