import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CONTENT_TYPE, HEADER_CONTENT_TYPE_JSON } from '../../../contracts/base-api';
import { RequestMethod } from '../../../models/mock.model';

@Injectable()
export class LogHttpInterceptor implements HttpInterceptor {
  constructor() {}

  public static dateToLogFormattedString(date: Date): string {
    return `${date.toLocaleTimeString()}.${date.getMilliseconds()}`;
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqTime = new Date();

    this.logRequest(req, reqTime);

    return next.handle(req).pipe(
      tap(
        (res: HttpResponse<any>) => {
          if (!this.canBeLogged(req)) {
            return;
          }

          console.groupCollapsed(
            `%c${req.method.toUpperCase()} ${req.urlWithParams}`,
            'color: green;',
          );
          console.log('Response body:', res.body);
          this.logOfResponseCode(res);
          this.logOfRequestCallTime(reqTime);
          console.groupEnd();
        },
        (res: HttpErrorResponse) => {
          if (!this.canBeLogged(req)) {
            return;
          }

          console.groupCollapsed(
            `%c${req.method.toUpperCase()} ${req.urlWithParams}`,
            'color: red;',
          );
          console.log('Response message:', res.message);
          this.logOfResponseCode(res);
          this.logOfRequestCallTime(reqTime);
          console.groupEnd();
        },
      ),
    );
  }

  // noinspection JSMethodCanBeStatic
  private logOfResponseCode(res: HttpResponseBase): void {
    console.log(`Response code: ${res.status} ${res.statusText}`);
  }

  // noinspection JSMethodCanBeStatic
  private logOfRequestCallTime(reqTime: Date): void {
    console.log('Request call time:', LogHttpInterceptor.dateToLogFormattedString(reqTime));
  }

  private logRequest(req: HttpRequest<any>, reqTime: Date): void {
    if (!this.canBeLogged(req)) {
      return;
    }

    console.groupCollapsed(`${req.method.toUpperCase()} ${req.urlWithParams}`);
    this.logBody(req);
    this.logHeaders(req);
    this.logOfRequestCallTime(reqTime);
    console.trace('Request stack trace:');
    console.groupEnd();
  }

  // noinspection JSMethodCanBeStatic
  private logBody(req: HttpRequest<any>): void {
    const methodsWithBody = [RequestMethod.Post, RequestMethod.Put];
    const requestHasBody = methodsWithBody.indexOf(req.method as RequestMethod) !== -1;
    if (requestHasBody) {
      console.log('Request body:', req.body);
    }
  }

  // noinspection JSMethodCanBeStatic
  private logHeaders(req: HttpRequest<any>): void {
    const headerKeyValuePairs = req.headers
      .keys()
      .filter(headerKey => {
        const headerValue = req.headers.get(headerKey);
        return headerKey !== CONTENT_TYPE && headerValue !== HEADER_CONTENT_TYPE_JSON[CONTENT_TYPE];
      })
      .map(headerKey => {
        return {
          'Header key': headerKey,
          'Header value': req.headers.get(headerKey),
        };
      });

    if (headerKeyValuePairs.length) {
      console.table(headerKeyValuePairs);
    }
  }

  // noinspection JSMethodCanBeStatic
  private canBeLogged(req: HttpRequest<any>): boolean {
    return this.isApiRequest(req);
  }

  // noinspection JSMethodCanBeStatic
  private isApiRequest(req: HttpRequest<any>): boolean {
    return /(^\/api)/.test(req.url);
  }
}
