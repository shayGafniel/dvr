import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { bulkCompanyInfoBig } from './bulk-company-info-big.mock';
import { HEADER_CONTENT_TYPE_PLAIN } from '../../../contracts/base-api';
import { DeadcartApiService } from './deadcart-api.service';
import { BulkCompaniesInfo, DeadcartCompanyInfo } from '../../../models/deadcart.model';
import { MockResponse, MockService, RequestMethod } from '../../../models/mock.model';

export let mock_company_info: () => DeadcartCompanyInfo = () => {
  return {
    companyId: 'companyId1',
    accountType: 'mockAccountType',
    active: true,
    name: 'Amazon UK',
    companyType: 'mockCompanyType',
    stage: 'mockStage',
    parent: 'Amazon',
    country: 'GB',
    domestic: false,
    validNames: ['Roga & Kopyta UK', 'Roga & Kopyta FR', 'Roga & Kopyta GR'],
    validGroupNames: ['Group Roga & Kopyta UK', 'Group Roga & Kopyta FR', 'Group Roga & Kopyta GR'],
    invalidNames: ['Baba', 'Saba', 'Abba'],
    legalName: 'Roga & Kopyta',
    legalAddress: 'address1',
    vatId: '123',
    vatRegistrations: [{ country: 'GB', vatNumber: '244', registrationYear: '1/9/84' }],
  };
};

@Injectable()
export class DeadcartApiMockService implements MockService {
  public static readonly isBigCompanyInfo = true;

  public readonly serviceName = DeadcartApiService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: (req: HttpRequest<any>) => {
        const mockCompanyInfoPerID = Object.assign({}, mock_company_info()); // Used in Expedite

        mockCompanyInfoPerID.companyId = req.params.get('companyId');

        return mockCompanyInfoPerID;
      },
      headers: new HttpHeaders(HEADER_CONTENT_TYPE_PLAIN), // Deadcart response is plain text
      method: RequestMethod.Get,
      status: 200,
      timeout: Math.floor(Math.random() * 5000), // Get a random value between 0 to 4999
      urlTest: new RegExp('/companyInfo\\?companyId=.+'),
    }),

    new MockResponse({
      getBody: (req: HttpRequest<{ ids: string[] }>): BulkCompaniesInfo => {
        return DeadcartApiMockService.isBigCompanyInfo
          ? {
              companiesInfo: req.body.ids.map((companyId, i) => ({
                ...bulkCompanyInfoBig.companiesInfo[i],
                companyId,
              })),
              failures: bulkCompanyInfoBig.failures,
            }
          : {
              companiesInfo: req.body.ids.map(companyId => ({ ...mock_company_info(), companyId })),
              failures: [],
            };
      },
      headers: new HttpHeaders(HEADER_CONTENT_TYPE_PLAIN),
      method: RequestMethod.Post,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/bulkCompanyInfo'),
    }),
  ];
}
