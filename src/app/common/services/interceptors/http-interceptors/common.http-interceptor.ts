import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponseBase,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  BaseApi,
  CONTENT_TYPE,
  HEADER_CONTENT_TYPE_JSON, HEADER_CONTENT_TYPE_MULTIPART_FORM_DATA,
  HTTP_NO_AUTH,
} from '../../../contracts/base-api';
import { LoggerService } from '../../logger/logger.service';
import { SecurityService } from '../../security/security.service';

@Injectable()
export class CommonHttpInterceptor implements HttpInterceptor {
  public bodyOfRequest = 0;
  constructor(private loggerService: LoggerService, private securityService: SecurityService) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestWithDefaultHeaders = this.getRequestWithDefaultHeaders(req);
    this.bodyOfRequest = req.body;

    return next
      .handle(requestWithDefaultHeaders)
      .pipe(
        tap(
          (event: HttpEvent<any>) => this.onResponse(event),
          (event: HttpEvent<any>) => this.onResponse(event),
        ),
      );
  }

  // noinspection JSMethodCanBeStatic
  private getRequestWithDefaultHeaders(req: HttpRequest<any>): HttpRequest<any> {
    // Do not add headers for multipart data, browser can handle it automatically
    if (req.headers.has(CONTENT_TYPE)
      && req.headers.get(CONTENT_TYPE) === HEADER_CONTENT_TYPE_MULTIPART_FORM_DATA[CONTENT_TYPE]) {
      return req.clone({
        headers: req.headers.delete(CONTENT_TYPE)
      });
    }

    if (req.headers.has(CONTENT_TYPE) || !BaseApi.isApiRequest(req.url)) {
      return req;
    }

    return req.clone({
      setHeaders: {
        [CONTENT_TYPE]: HEADER_CONTENT_TYPE_JSON[CONTENT_TYPE],
      },
    });
  }

  private onResponse(event: HttpEvent<any> | HttpErrorResponse): void {
    if (event instanceof HttpResponseBase) {
      this.logResponse(event);
      this.checkNoAuthStatus(event);
    }
  }

  private logResponse(res: HttpResponseBase): void {
    this.loggerService.addLog(res, this.bodyOfRequest); // for technical support
  }

  private checkNoAuthStatus(res: HttpResponseBase): void {
    if (res.status === HTTP_NO_AUTH) {
      this.securityService.cleanAndLogout();
    }
  }
}
