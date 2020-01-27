import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { WorkEntitiesApiService } from './work-entities-api.service';

@Injectable()
export class WorkEntitiesApiImpl extends WorkEntitiesApiService {
  // noinspection JSUnusedGlobalSymbols
  protected getWorkEntitiesApi = '';

  constructor(protected http: HttpClient) {
    super(http);
  }

  // noinspection JSUnusedGlobalSymbols
  protected getWorkEntitiesMap = () => [];

  public updateWorkEntities(entitiesIds: string[]): Observable<any> {
    return of();
  }
}

describe('WorkEntitiesApiService', () => {
  let api: WorkEntitiesApiImpl;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkEntitiesApiImpl],
    });
  }));

  beforeEach(() => {
    api = TestBed.get(WorkEntitiesApiImpl);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(api).toBeTruthy();
  });
});
