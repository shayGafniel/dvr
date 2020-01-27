import { Injectable } from '@angular/core';

import { MockResponse, MockService, RequestMethod } from '~/common/models/mock.model';
import { DashboardApiMock } from './dashboard-api.mock';
import { DashboardApiService } from './dashboard-api.service';

@Injectable()
export class DashboardApiMockService implements MockService {
  public readonly serviceName = DashboardApiService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: DashboardApiMock.getDashboard,
      method: RequestMethod.Post,
      status: 200,
      urlTest: new RegExp(`${DashboardApiService.DASHBOARD_API}$`),
    }),
    new MockResponse({
      getBody: DashboardApiMock.getDashboardGraphs,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${DashboardApiService.DASHBOARD_GRAPHS_API}($|[^/]+)`),
    }),
    new MockResponse({
      getBody: DashboardApiMock.getDashboardPromotion,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${DashboardApiService.DASHBOARD_PROMOTIONS_API}($|[^/]+)`),
    }),
  ];
}
