import { Injectable } from '@angular/core';

import { MockResponse, MockService, RequestMethod } from '../../models/mock.model';
import { SecurityApiService } from './security-api.service';

@Injectable()
export class SecurityApiMockService implements MockService {
  public readonly serviceName = SecurityApiService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: () => '',
      method: RequestMethod.Put,
      status: 200,
      timeout: 50,
      urlTest: new RegExp(SecurityApiService.LOGOUT_URL),
    }),
  ];
}
