import { TestBed } from '@angular/core/testing';

import { CommentsOnCouplePhotoService } from './comments-on-couple-photo.service';

describe('CommentsOnCouplePhotoService', () => {
  let service: CommentsOnCouplePhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsOnCouplePhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
