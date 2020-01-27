import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { CommonHttpInterceptor } from './common.http-interceptor';
import { CONTENT_TYPE, HTTP_NO_AUTH } from '../../../contracts/base-api';
import { LoggerService } from '../../logger/logger.service';
import { SecurityService } from '../../security/security.service';

@Injectable()
class StubService {
  public readonly apiUrl = '/api/some/url';
  public readonly noApiUrl = '/some/url';

  constructor(private http: HttpClient) {}

  public getApiData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  public getNoApiData(): Observable<any> {
    return this.http.get(this.noApiUrl);
  }
}

class StubLoggerService implements Partial<LoggerService> {
  public addLog(): void {}
}

class StubSecurityService implements Partial<SecurityService> {
  public logout(): void {}
}

describe('CommonHttpInterceptor', () => {
  let httpInterceptor: CommonHttpInterceptor;
  let httpMock: HttpTestingController;
  let service: StubService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StubService,
        { provide: HTTP_INTERCEPTORS, useClass: CommonHttpInterceptor, multi: true },
        { provide: LoggerService, useClass: StubLoggerService },
        { provide: SecurityService, useClass: StubSecurityService },
      ],
    });
  }));

  beforeEach(() => {
    httpInterceptor = TestBed.get(HTTP_INTERCEPTORS).find(i => i instanceof CommonHttpInterceptor);
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(StubService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpInterceptor).toBeTruthy();
  });

  it('should add the Content-Type header for api calls', () => {
    service.getApiData().subscribe();
    const httpApiRequest = httpMock.expectOne(service.apiUrl);
    expect(httpApiRequest.request.headers.has(CONTENT_TYPE)).toBeTruthy(
      'Content-Type header was not found',
    );

    service.getNoApiData().subscribe();
    const httpNoApiRequest = httpMock.expectOne(service.noApiUrl);
    expect(httpNoApiRequest.request.headers.has(CONTENT_TYPE)).toBeFalsy(
      'Content-Type header must be missed',
    );
  });

  it('should call logger on each response', () => {
    const spyAddLog = spyOn(TestBed.get(LoggerService), 'addLog');

    service
      .getApiData()
      .subscribe(
        () => expect(spyAddLog.calls.any()).toBeTruthy('logger was not called'),
        () => expect(true).toBe(false, 'unexpected error'),
      );

    httpMock.expectOne(service.apiUrl).flush('');
  });

});
