import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { DvrApiService } from './dvr-api.service';

describe('DvrApiService', () => {
  let api: DvrApiService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DvrApiService],
    });
  }));

  beforeEach(() => {
    api = TestBed.get(DvrApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(api).toBeTruthy();
  });
});
