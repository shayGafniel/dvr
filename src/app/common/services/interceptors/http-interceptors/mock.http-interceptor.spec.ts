import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { MockCollectionService } from '../../mock-collection/mock-collection.service';
import { MockHttpInterceptor } from './mock.http-interceptor';
import { MockResponse, RequestMethod } from '../../../models/mock.model';

@Injectable()
class StubService {
  public static readonly url = '/api/some_url';

  constructor(private http: HttpClient) {}

  public getData(): Observable<any> {
    return this.http.get(StubService.url);
  }
}

class StubMockCollectionService implements Partial<MockCollectionService> {
  public canBeFound = true;

  public getBody = () => 'response body';

  // noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
  public findMockResponse(req: HttpRequest<any>): MockResponse {
    if (this.canBeFound) {
      return new MockResponse({
        getBody: this.getBody,
        method: RequestMethod.Get,
        status: 200,
        timeout: 0,
        urlTest: new RegExp(''),
      });
    }
  }
}

describe('MockHttpInterceptor', () => {
  let httpInterceptor: MockHttpInterceptor;
  let httpMock: HttpTestingController;
  let mockCollectionService: StubMockCollectionService;
  let service: StubService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StubService,
        { provide: HTTP_INTERCEPTORS, useClass: MockHttpInterceptor, multi: true },
        { provide: MockCollectionService, useClass: StubMockCollectionService },
      ],
    });
  }));

  beforeEach(() => {
    httpInterceptor = TestBed.get(HTTP_INTERCEPTORS).find(i => i instanceof MockHttpInterceptor);
    httpMock = TestBed.get(HttpTestingController);
    mockCollectionService = TestBed.get(MockCollectionService);
    service = TestBed.get(StubService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpInterceptor).toBeTruthy();
  });

  it('should intercept http and return mocked response', (done: DoneFn) => {
    service.getData().subscribe(
      res => {
        expect(res).toEqual(mockCollectionService.getBody(), 'response body is not mocked body');
        done();
      },
      () => {
        expect(true).toBe(false, 'unexpected error');
        done();
      },
    );
  });

  it('should return an error response if no mock data found', (done: DoneFn) => {
    mockCollectionService.canBeFound = false;

    service.getData().subscribe(
      () => {
        expect(true).toBe(false, 'unexpected success response');
        done();
      },
      err => {
        expect(err instanceof HttpErrorResponse).toBeTruthy(
          'no mock data error is not a HttpErrorResponse instance',
        );
        done();
      },
    );
  });
});
