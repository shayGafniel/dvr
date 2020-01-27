import { HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';

import { BaseApi } from '../../contracts/base-api';
import { MockResponse, MockService } from '../../models/mock.model';

export const MOCK_SERVICES = new InjectionToken<MockService[]>('MockService[]');

@Injectable()
export class MockCollectionService {
  private mockResponses: MockResponse[] = [];

  constructor(@Inject(MOCK_SERVICES) private mockServices: MockService[]) {
    this.addMockResponses();
  }

  private addMockResponses(): void {
    this.mockServices.forEach((mockService: MockService) => {
      mockService.mockResponses.forEach(mockResponse => {
        mockResponse.serviceName = mockResponse.serviceName
          ? mockResponse.serviceName
          : mockService.serviceName;
      });

      this.mockResponses.push(...mockService.mockResponses);
    });
  }

  public findMockResponse(req: HttpRequest<any>): MockResponse {
    const reqServiceName = BaseApi.getServiceNameFromRequest(req.url);

    return this.mockResponses.find(mockResponse => {
      const isMatchedServiceName = this.isMatchedServiceName(mockResponse, reqServiceName);
      const isMatchedMethod = mockResponse.method === req.method;
      const isMatchedUrl = mockResponse.urlTest.test(req.urlWithParams);

      return isMatchedServiceName && isMatchedMethod && isMatchedUrl;
    });
  }

  // noinspection JSMethodCanBeStatic
  private isMatchedServiceName(mockResponse: MockResponse, reqServiceName: string): boolean {
    if (typeof mockResponse.serviceName === 'string') {
      return mockResponse.serviceName === reqServiceName;
    }

    return mockResponse.serviceName.indexOf(reqServiceName) !== -1;
  }

  public getMockResponses(): MockResponse[] {
    return this.mockResponses;
  }
}
