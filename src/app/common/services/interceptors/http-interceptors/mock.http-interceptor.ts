import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as statusTexts from 'builtin-status-codes';
import { Observable } from 'rxjs';

import { BaseApi } from '../../../contracts/base-api';
import { MockCollectionService } from '../../mock-collection/mock-collection.service';
import { MockResponse } from '../../../models/mock.model';

@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {
  constructor(private mockCollection: MockCollectionService) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!BaseApi.isApiRequest(req.url)) {
      return next.handle(req);
    }

    return this.getMockedHttpResponse(req);
  }

  private getMockedHttpResponse(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable(subscriber => {
      const matchedMockResponse: MockResponse = this.mockCollection.findMockResponse(req);

      if (matchedMockResponse) {
        setTimeout(() => {
          const status = matchedMockResponse.getStatus(req);

          if (status < 400) {
            subscriber.next(
              new HttpResponse({
                body: matchedMockResponse.getBody(req),
                headers: matchedMockResponse.headers,
                status: status,
                statusText: statusTexts[status],
              }),
            );
            subscriber.complete();
          } else {
            subscriber.error(
              new HttpErrorResponse({
                error: matchedMockResponse.getBody(req),
                status: status,
                statusText: statusTexts[status],
              }),
            );
          }
        }, matchedMockResponse.timeout);
      } else {
        subscriber.error(
          new HttpErrorResponse({
            error: `No mock data was found for '${req.method} ${req.url}'`,
            status: 404,
            statusText: 'Not Found',
          }),
        );
      }
    });
  }
}
