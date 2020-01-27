import { Injectable } from '@angular/core';

import { MockResponse, MockService, RequestMethod } from '~/common/models/mock.model';
import { TableauTicket } from '~/shared/models/tableau.model';
import { TableauApiService } from './tableau-api.service';

@Injectable()
export class TableauApiMockService implements MockService {
  public readonly serviceName = TableauApiService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: () => ({ key: '' } as TableauTicket),
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${TableauApiService.TABLEAU_PROXY_API}$`),
    }),
  ];
}
