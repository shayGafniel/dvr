import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ApplicationHttpErrorCode, stringFromAny } from '../utils/utils';

export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_NO_CONTENT = 204;
export const HTTP_NO_AUTH = 401;
export const HTTP_FORBIDDEN = 403;

export const CONTENT_TYPE = 'Content-Type';
export const HEADER_CONTENT_TYPE_JSON = { [CONTENT_TYPE]: 'application/json' };
export const HEADER_CONTENT_TYPE_PLAIN = { [CONTENT_TYPE]: 'text/plain; charset=utf-8' };
export const HEADER_CONTENT_TYPE_MULTIPART_FORM_DATA = { [CONTENT_TYPE]: 'multipart/form-data' };

export abstract class ServerResponseBase {
  public httpStatus: number;
  public httpStatusText?: string;
  public httpBodyText?: string;
  public httpBodyObject?: any;

  constructor(rawData: ServerResponseBase) {
    Object.assign(this, rawData);
  }

  public modify?<T extends ServerResponseBase>(
    res: HttpResponseBase,
    modifierFn?: (res?: HttpResponseBase, resJson?: any) => T,
  ): T | ServerResponseBase {
    if (typeof modifierFn === 'function') {
      return Object.assign(this, modifierFn(res, this.httpBodyObject));
    }

    return this.httpBodyObject ? Object.assign(this, this.httpBodyObject) : this;
  }
}

export class ServerResponse extends ServerResponseBase {}

export class ServerErrorResponse extends ServerResponseBase {}

export function createServerResponse(res: HttpResponseBase): ServerResponseBase {
  if (res instanceof HttpResponse) {
    return new ServerResponse({
      httpStatus: res.status,
      httpStatusText: res.statusText,
      httpBodyText: stringFromAny(res.body),
      httpBodyObject: res.body instanceof Object ? res.body : null,
    });
  } else if (res instanceof HttpErrorResponse) {
    return new ServerErrorResponse({
      httpStatus: res.status,
      httpStatusText: res.statusText,
      httpBodyText: stringFromAny(res.error) || res.message,
      httpBodyObject: res.error instanceof Object ? res.error : null,
    });
  }
}

export abstract class BaseApi {
  public static readonly serviceNameTest = new RegExp('/(?:ng-api|api)/([a-z0-9_-]*)/');
  public static readonly isApiUrlTest = new RegExp('^/(?:ng-api|api)/');

  constructor(protected http: HttpClient) {}

  public static getServiceNameFromRequest(url: string): string {
    const serviceName = url.match(this.serviceNameTest);
    return Array.isArray(serviceName) ? serviceName[1] : null;
  }

  public static isApiRequest(url: string): boolean {
    return this.isApiUrlTest.test(url);
  }

  /**
   convert HttpResponse object to ServerResponse structure that looks like:
   {
   httpStatus: HTTP status code
   <merged fields of the response>: SEE BELOW
   };
   NOTE: merges modifierFn() returned value if func exists, otherwise, merges response JSON
   */
  protected responseToServerResponse<S extends ServerResponse, E extends ServerErrorResponse>(
    responseStream: Observable<HttpResponseBase>,
    modifierFn?: (res?: HttpResponseBase, resJson?: any) => any,
    errorModifierFn?: (res?: HttpResponseBase, resJson?: any) => any,
  ): Observable<S> {
    return responseStream.pipe(
      map(res => this.getModifiedServerResponse<S>(res, modifierFn)),
      catchError(errorRes => {
        ApplicationHttpErrorCode.lastHttpError = errorRes && errorRes.status;
        return throwError(this.getModifiedServerResponse<E>(errorRes, errorModifierFn));
      }),
    );
  }

  // noinspection JSMethodCanBeStatic
  private getModifiedServerResponse<T extends ServerResponseBase>(
    res: HttpResponseBase,
    modifierFn?: (res?: HttpResponseBase, resJson?: any) => T,
  ): T {
    if (!(res instanceof HttpResponseBase)) {
      throw res;
    }
    const serverResponse = createServerResponse(res);

    return serverResponse.modify(res, modifierFn) as T;
  }
}
