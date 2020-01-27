import {HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ImaginaryService} from './imaginary.service';
import {MockResponse, MockService, RequestMethod} from '../../models/mock.model';
import {imageInfoBody} from './imaginary.mock';


@Injectable()
export class ImaginaryMockService implements MockService {
  public readonly serviceName = ImaginaryService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: imageInfoBody,
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/api/imaginary/v1.0/[^/]*/info'),
    }),
    new MockResponse({
      getBody: () => ({}),
      method: RequestMethod.Post,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/api/imaginary/v1.0/[^/]*/digest'),
    }),
    new MockResponse({
      getBody: (req: HttpRequest<any>) => ({
        id: req.url.substr(26),
        mimeType: 'image/png',
      }),
      method: RequestMethod.Post,
      status: 201,
      timeout: 500,
      urlTest: new RegExp('/asset'),
    }),
  ];
}
