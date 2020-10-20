import { TestBed } from '@angular/core/testing';

import { UserHikesService } from './user-hikes.service';

describe('UserHikesService', () => {
  let service: UserHikesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHikesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
