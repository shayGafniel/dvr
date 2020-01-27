import { Injectable } from '@angular/core';

import { FilteredGroupsResponse } from '../../models/invoices-models/filters-data.model';
import { MockResponse, MockService, RequestMethod } from '../../models/mock.model';
import { InvoicesMockFiltersConf, MockFilteredCompanies } from './mock/filters-data-mock';
import { GateApiService } from './gate-api.service';
import { invoicesListCounts } from './mock/invoices-list-counts.mock';
import { MockInvoiceById, MockInvoicesList, mock_invoices_count } from './mock/mock-invoices-list';
import { HttpRequest } from '@angular/common/http';
import { reclaimsListCounts } from './mock/reclaims-list-counts.mock';
import { reclaimsList } from './mock/reclaims-list.mock';
import { reclaimShow, reclaimShowInvoices } from './mock/reclaim-show.mock';
import { userData } from './mock/user-company.mock';

@Injectable()
export class GateApiMockService implements MockService {
  public readonly serviceName = GateApiService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    new MockResponse({
      getBody: InvoicesMockFiltersConf.invoicesMockFiltersConf,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('invoices_data/options'),
    }),

    new MockResponse({
      getBody: MockFilteredCompanies.MatchedInvoice,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${GateApiService.MATCHED_INVOICES_API}`),
    }),

    new MockResponse({
      getBody: MockFilteredCompanies.FilteredCompanies1,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('term=a'),
    }),

    new MockResponse({
      getBody: MockFilteredCompanies.FilteredCompanies2,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('term=b'),
    }),

    new MockResponse({
      getBody: MockFilteredCompanies.FilteredCompanies1,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('filtered_ids'),
    }),

    new MockResponse({
      getBody: (req: HttpRequest<FilteredGroupsResponse>) => {
        return MockFilteredCompanies.FilteredGroups(parseInt(req.params.get('account_id'), 10));
      },
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${GateApiService.GET_COMPANIES_GROUPS_API}`),
    }),

    new MockResponse({
      getBody: MockFilteredCompanies.FilteredCompanies1,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('companies'),
    }),

    new MockResponse({
      getBody: InvoicesMockFiltersConf.optionsByInvoiceId,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('all'),
    }),

    new MockResponse({
      getBody: MockInvoiceById.mockInvoice,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('invoices_data/69526076'),
    }),

    new MockResponse({
      getBody: MockInvoiceById.mockInvoice_2,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp('invoices_data/69526075'),
    }),

    new MockResponse({
      getBody: MockInvoicesList.mockInvoices,
      method: RequestMethod.Post,
      status: 200,
      urlTest: new RegExp('invoices_data'),
    }),

    new MockResponse({
      getBody: () => {
        return { next_invoice: '69526075' };
      },
      method: RequestMethod.Put,
      status: 200,
      urlTest: new RegExp('invoices_data'),
    }),
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForInvoicesCount(req).body,
      method: RequestMethod.Post,
      status: (req: HttpRequest<any>) => this.getBodyAndStatusForInvoicesCount(req).status,
      timeout: 500,
      urlTest: new RegExp('/vendors/invoices_count_bulk'),
    }),

    new MockResponse({
      getBody: reclaimsListCounts,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${GateApiService.RECLAIMS_COUNTS}$`),
    }),

    new MockResponse({
      getBody: invoicesListCounts,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${GateApiService.INVOICES_COUNTS}$`),
    }),

    new MockResponse({
      getBody: reclaimShow,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${GateApiService.RECLAIMS_BASE}/\\d*$`),
    }),

    new MockResponse({
      getBody: reclaimShowInvoices,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${GateApiService.RECLAIMS_BASE}/\\d*/invoices\\S*$`),
    }),

    new MockResponse({
      getBody: reclaimsList,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${GateApiService.RECLAIMS_BASE}\\?*\\S*$`),
    }),

    new MockResponse({
      getBody: userData,
      method: RequestMethod.Get,
      status: 200,
      urlTest: new RegExp(`${GateApiService.TOP_LEVEL_COMPANY}$`),
    }),
  ];

  // noinspection JSMethodCanBeStatic
  private getBodyAndStatusForInvoicesCount(req: HttpRequest<any>): { body: any; status: number } {
    const vendorsIds: number[] = req.body['vendor_ids'];
    return {
      body: mock_invoices_count(vendorsIds),
      status: 200,
    };
  }
}
