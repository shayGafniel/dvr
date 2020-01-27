import { HttpParams, HttpRequest } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';

import { MOCK_SERVICES, MockCollectionService } from './mock-collection.service';
import { MockResponse, MockService, RequestMethod } from '../../models/mock.model';

class ApiOneService {
  public static VATBOX_SERVICE_NAME = 'one';
}

class ApiTwoService {
  public static VATBOX_SERVICE_NAME = 'two';
  public static VATBOX_SECOND_SERVICE_NAME = 'two-second';
}

const getBodies = [
  () => ({ data: 'some data 1' }),
  () => ({ data: 'some data 2' }),
  () => ({ data: 'some data 3' }),
  () => ({ data: 'some data 4' }),
  () => ({ data: 'some data 5' }),
];

const methods: any[] = [
  RequestMethod.Get,
  RequestMethod.Post,
  RequestMethod.Put,
  RequestMethod.Get,
  RequestMethod.Get,
];

const urls = [
  `\/api\/${ApiOneService.VATBOX_SERVICE_NAME}\/url_1`,
  `\/api\/${ApiTwoService.VATBOX_SERVICE_NAME}\/url_2`,
  `\/api\/${ApiTwoService.VATBOX_SECOND_SERVICE_NAME}\/url_3`,
  `\/api\/${ApiTwoService.VATBOX_SERVICE_NAME}\/url_4`,
  `\/api\/${ApiOneService.VATBOX_SERVICE_NAME}\/url_5`,
];

const someParam = 'someParam';

export class StubOneMockService implements MockService {
  public readonly serviceName = ApiOneService.VATBOX_SERVICE_NAME;

  // noinspection JSUnusedGlobalSymbols
  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: getBodies[0],
      method: methods[0],
      status: 200,
      timeout: 0,
      urlTest: new RegExp(urls[0]),
    }),
  ];
}

export class StubTwoMockService implements MockService {
  public readonly serviceName = [
    ApiTwoService.VATBOX_SERVICE_NAME,
    ApiTwoService.VATBOX_SECOND_SERVICE_NAME,
  ];

  // noinspection JSUnusedGlobalSymbols
  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: getBodies[1],
      method: methods[1],
      status: 200,
      timeout: 0,
      urlTest: new RegExp(urls[1]),
    }),
    new MockResponse({
      getBody: getBodies[2],
      method: methods[2],
      status: 200,
      timeout: 0,
      urlTest: new RegExp(urls[2]),
    }),
    new MockResponse({
      getBody: getBodies[3],
      method: methods[3],
      status: 200,
      timeout: 0,
      urlTest: new RegExp(`${urls[3]}\\?${someParam}=.+`),
    }),
    new MockResponse({
      getBody: getBodies[4],
      method: methods[4],
      status: 200,
      timeout: 0,
      urlTest: new RegExp(urls[4]),
    }),
  ];
}

describe('MockCollectionService', () => {
  let mockCollectionService: MockCollectionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MockCollectionService,
        { provide: MOCK_SERVICES, useClass: StubOneMockService, multi: true },
        { provide: MOCK_SERVICES, useClass: StubTwoMockService, multi: true },
      ],
    });
  }));

  beforeEach(() => {
    mockCollectionService = TestBed.get(MockCollectionService);
  });

  it('should be created', () => {
    expect(mockCollectionService).toBeTruthy();
  });

  it('should add MockResponse instances', () => {
    expect(mockCollectionService.getMockResponses().length).toBe(
      getBodies.length,
      'MockResponse instances was not added',
    );
  });

  it('should set service names to MockResponse instances', () => {
    const allMockResponsesHaveApiService = mockCollectionService
      .getMockResponses()
      .every(mockResponse => {
        const isString = typeof mockResponse.serviceName === 'string';
        const isArray = Array.isArray(mockResponse.serviceName);

        return isString || isArray;
      });

    expect(allMockResponsesHaveApiService).toBeTruthy(
      'some MockResponse instances do not have ApiService',
    );
  });

  it('should find MockResponse instances by a request', () => {
    function testSearchOfMockResponse(index: number): void {
      const req = new HttpRequest<any>(methods[index], urls[index]);
      const mockResponse = mockCollectionService.findMockResponse(req);
      expect(mockResponse).toBeTruthy(`mock response for "${urls[index]}" was not found`);
      expect(mockResponse.getBody(req)).toEqual(
        getBodies[index](),
        `mock response for "${urls[index]}" is wrong`,
      );
    }

    testSearchOfMockResponse(0);
    testSearchOfMockResponse(1);
    testSearchOfMockResponse(2);
  });

  it('should find MockResponse instances by a request with a param', () => {
    const req = new HttpRequest<any>(methods[3], urls[3], {
      params: new HttpParams({ fromObject: { someParam } }),
    });
    const mockResponse = mockCollectionService.findMockResponse(req);
    expect(mockResponse).toBeTruthy(`mock response for "${req.urlWithParams}" was not found`);
    expect(mockResponse.getBody(req)).toEqual(
      getBodies[3](),
      `mock response for "${req.urlWithParams}" is wrong`,
    );
  });

  it('should find MockResponse instances by an ApiService', () => {
    const req = new HttpRequest<any>(methods[4], urls[4]);
    const mockResponse = mockCollectionService.findMockResponse(req);
    expect(mockResponse).toBeFalsy('search ignores ApiService');
  });
});
