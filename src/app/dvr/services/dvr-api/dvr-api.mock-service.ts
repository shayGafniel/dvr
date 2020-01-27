import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DvrApiService } from './dvr-api.service';
import { DvrMock } from './dvr.mock';
import { MockResponse, MockService, RequestMethod } from '../../../common/models/mock.model';

@Injectable()
export class DvrApiMockService implements MockService {
  public readonly serviceName = DvrApiService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: DvrMock.createDraft,
      method: RequestMethod.Post,
      status: 201,
      urlTest: new RegExp(`${DvrApiService.DRAFT_API}$`),
    }),
    new MockResponse({
      getBody: DvrMock.doApprove,
      method: RequestMethod.Put,
      status: 200,
      urlTest: new RegExp(`${DvrApiService.APPROVES_API}/($|[^/]+)`),
    }),
    new MockResponse({
      getBody: DvrMock.getAccountStatistics,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${DvrApiService.ACCOUNTS_API}/[^/.]+/statistics$`),
    }),
    new MockResponse({
      getBody: DvrMock.getApprove,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${DvrApiService.APPROVES_API}/[^/.]+$`),
    }),
    new MockResponse({
      getBody: DvrMock.getCasesResponse,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${DvrApiService.ACCOUNTS_API}/[^/.]+/cases($|[^/]+)`),
    }),
    new MockResponse({
      getBody: (req: HttpRequest<any>) => {
        const accountId = req.url.match(/accounts\/([^\/.]+)\/entities/)[1];

        return DvrMock.getEntities(parseInt(accountId, 10));
      },
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('/entities($|[^/]+)'),
    }),
    new MockResponse({
      getBody: DvrMock.getEntityStatistics,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(
        `${DvrApiService.ACCOUNTS_API}/[^/.]+/entities/[^/.]+/statistics($|[^/]+)`,
      ),
    }),
    new MockResponse({
      getBody: (req: HttpRequest<any>) => {
        const country = req.params.get('country');

        return DvrMock.getRefunds(country);
      },
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${DvrApiService.ACCOUNTS_API}/[^/.]+/entities/[^/.]+/refunds`),
    }),
    new MockResponse({
      getBody: () => ({}),
      method: RequestMethod.Delete,
      status: 200,
      urlTest: new RegExp(`${DvrApiService.ACCOUNTS_API}/[^/.]+/cases/[^/.]+$`),
    }),
  ];
}
