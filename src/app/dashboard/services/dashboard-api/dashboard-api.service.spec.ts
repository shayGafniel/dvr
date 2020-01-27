import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { DashboardApiService } from './dashboard-api.service';

describe('DashboardApiService', () => {
  let api: DashboardApiService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardApiService],
    });
  }));

  beforeEach(() => {
    api = TestBed.get(DashboardApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(api).toBeTruthy();
  });
});
