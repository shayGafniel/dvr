import { Injectable } from '@angular/core';

import { ConfigurationAPIService } from './configuration-api.service';
import {
  configurationResponse,
  countriesExpert,
  mock_canada_provinces,
  mock_documents_types,
  mock_vat_table,
} from './configuration.mock';
import { MockResponse, MockService, RequestMethod } from '../../models/mock.model';

@Injectable()
export class ConfigurationApiMockService implements MockService {
  public readonly serviceName = ConfigurationAPIService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: countriesExpert,
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: new RegExp(ConfigurationAPIService.GET_COUNTRIES_EXPERT_API.replace('?', '\\?')),
    }),
    new MockResponse({
      getBody: () => ({ docTypes: mock_documents_types() }),
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: /\/getDocumentTypes/,
    }),
    new MockResponse({
      getBody: mock_vat_table,
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: /\/getVatRates/,
    }),
    new MockResponse({
      getBody: mock_canada_provinces,
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: /\/countries\/CA\/provinces/,
    }),
    new MockResponse({
      getBody: configurationResponse,
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: /\/api\/configuration/,
    }),
  ];
}
