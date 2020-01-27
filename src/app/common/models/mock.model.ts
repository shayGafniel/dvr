import { HttpHeaders, HttpRequest } from '@angular/common/http';

export enum RequestMethod {
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export class MockResponse {
  public serviceName?: string | string[];
  public getBody: (req: HttpRequest<any>) => any;
  public headers?: HttpHeaders;
  public method: RequestMethod;
  public status: number | ((req: HttpRequest<any>) => number);
  public timeout?: number = 500;
  public urlTest: RegExp;

  constructor(mockResponse: MockResponse) {
    Object.assign(this, mockResponse);
  }

  public getStatus?(req: HttpRequest<any>): number {
    return typeof this.status === 'function' ? this.status(req) : this.status;
  }
}

export interface MockService {
  readonly serviceName: string | string[];
  readonly mockResponses: MockResponse[];
}
