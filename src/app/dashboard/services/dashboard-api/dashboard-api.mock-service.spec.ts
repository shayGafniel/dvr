import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';

import { MockHttpInterceptor } from '~/common/services/interceptors/http-interceptors/mock.http-interceptor';
import {
  MOCK_SERVICES,
  MockCollectionService,
} from '~/common/services/mock-collection/mock-collection.service';
import { DashboardApiMockService } from './dashboard-api.mock-service';
import { DashboardApiService } from './dashboard-api.service';
import { DashboardApiMock } from './dashboard-api.mock';
import { Dashboard, DashboardFilters, DashboardGraphsFilters } from '../../models/dashboard.model';
import { CommonUtil } from '~/shared/utils/common.util';

const dashboardFilters: DashboardFilters = {};
const dashboardGraphsFilters: DashboardGraphsFilters = {};

describe('DashboardApiMockService', () => {
  let api: DashboardApiService;
  let mock: DashboardApiMockService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        DashboardApiService,
        MockCollectionService,
        { provide: MOCK_SERVICES, useClass: DashboardApiMockService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: MockHttpInterceptor, multi: true },
      ],
    });
  }));

  beforeEach(() => {
    api = TestBed.get(DashboardApiService);
    mock = TestBed.get(MOCK_SERVICES)[0];

    mock.mockResponses.forEach(mockResponse => (mockResponse.timeout = 0));
  });

  it('should get mock data to getDashboard', () => {
    api.getDashboard(dashboardFilters).subscribe(data => {
      expect(data).toEqual(CommonUtil.keysToCamelCase<Dashboard>(DashboardApiMock.getDashboard()));
    });
  });

  it('should get mock data to getDashboardGraphs', () => {
    api.getDashboardGraphs(dashboardGraphsFilters).subscribe(data => {
      expect(data).toEqual(DashboardApiMock.getDashboardGraphs());
    });
  });
});
