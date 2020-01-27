import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { LogHttpInterceptor } from './log.http-interceptor';

describe('LogHttpInterceptor', () => {
  let httpInterceptor: LogHttpInterceptor;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: LogHttpInterceptor, multi: true }],
    });
  }));

  beforeEach(() => {
    httpInterceptor = TestBed.get(HTTP_INTERCEPTORS).find(i => i instanceof LogHttpInterceptor);
  });

  it('should be created', () => {
    expect(httpInterceptor).toBeTruthy();
  });
});
