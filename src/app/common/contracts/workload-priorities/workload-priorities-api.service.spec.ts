import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { WorkloadPrioritiesApiService } from './workload-priorities-api.service';

@Injectable()
export class WorkloadPrioritiesApiImpl extends WorkloadPrioritiesApiService {
  public static baseApi = 'base';

  constructor(protected http: HttpClient) {
    super(http, WorkloadPrioritiesApiImpl.baseApi);
  }
}

describe('WorkloadPrioritiesApiService', () => {
  let api: WorkloadPrioritiesApiImpl;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkloadPrioritiesApiImpl],
    });
  }));

  beforeEach(() => {
    api = TestBed.get(WorkloadPrioritiesApiImpl);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(api).toBeTruthy();
  });
});
