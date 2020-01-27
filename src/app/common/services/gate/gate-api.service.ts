import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { convertObjectKeysSnakeToCamelCase } from '../../utils/utils';
import {
  FilteredGroupsResponse,
  FiltersData,
} from '../../models/invoices-models/filters-data.model';
import {
  GetFieldsOptionsServerBody,
  GetInvoiceByIdServerBody,
  GetInvoicesServerBody,
  InvoicesOptionsResponse,
  InvoicesPutInvoiceBody,
  PutInvoiceResponseBody,
  VatRegServerParams,
  VatRegServerResponse,
} from '../../models/invoices-models/invoice.model';
import { InvoiceListCountsServer } from './models/invoice-list-counts-server';
import { TaxTailorEntitiesParams, TaxTailorImaginaryIdsParams, UserCompany } from './models/rails-data.model';
import { ReclaimListServerResponse } from './models/reclaim-list-server-response';
import { ReclaimListCountsServer } from './models/reclaim-list-counts-server';
import { ReclaimShowItemServer } from './models/reclaim-show-item-server';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class GateApiService {
  public static VATBOX_SERVICE_NAME = 'gate';
  public static API_BASE = `/api/${GateApiService.VATBOX_SERVICE_NAME}/v1`;
  public static INVOICES_API = `${GateApiService.API_BASE}/invoices_data`;
  public static MATCHED_INVOICES_API = `${GateApiService.API_BASE}/invoices_data/matched_invoices`;
  public static INVOICES_OPTIONS = `${GateApiService.INVOICES_API}/options`;
  public static GET_COMPANIES_API = `${GateApiService.API_BASE}/invoices_data/companies`;
  public static GET_COMPANIES_GROUPS_API = `${
    GateApiService.API_BASE
  }/invoices_data/company_groups`;
  public static VENDOR_INVOICES_COUNT = `${GateApiService.API_BASE}/vendors/invoices_count_bulk`;
  public static INVOICES_COUNTS = `${GateApiService.API_BASE}/invoices_data/counts`;
  public static INVOICE_API = `${GateApiService.API_BASE}/invoice_data`;

  // RECLAIMS API
  public static RECLAIMS_BASE = `/api/${GateApiService.VATBOX_SERVICE_NAME}/v1/reclaims`;
  public static RECLAIMS_COUNTS = `${GateApiService.RECLAIMS_BASE}/counts`;

  public static TOP_LEVEL_COMPANY = `/api/${
    GateApiService.VATBOX_SERVICE_NAME
  }/v1/top_permitted_entity`;

  // TAX TAILOR REJECTED REASON API
  public static IMAGINARY_IDS_BY_REASON = `${GateApiService.API_BASE}/imaginaries_by_reason`;
  public static TAX_TAILOR_ENTITIES = `${GateApiService.API_BASE}/invoices_data/tax-tailor/entities`;

  public constructor(private http: HttpClient) {}

  public getInvoicesList(filterValues: any): Observable<any> {
    return this.http.post(GateApiService.INVOICES_API, filterValues, httpOptions).pipe(
      map(res => {
        return this.translateInvoicesResponse(res as GetInvoicesServerBody);
      }),
    );
  }

  public getMatchedInvoices(accountId): Observable<any> {
    const httpParams = new HttpParams().set('account_id', accountId.toString());
    return this.http.get(GateApiService.MATCHED_INVOICES_API, {
      params: httpParams,
      ...httpOptions,
    });
  }

  public translateInvoicesResponse(resJson: GetInvoicesServerBody) {
    return {
      invoices: resJson.invoices.map(invoice => {
        return convertObjectKeysSnakeToCamelCase(invoice);
      }),
    };
  }

  public getInvoicesSelectorOptions(
    selectorName: keyof FiltersData,
  ): Observable<InvoicesOptionsResponse> {
    return this.http.get<InvoicesOptionsResponse>(GateApiService.INVOICES_OPTIONS, {
      params: {
        group: selectorName,
      },
    });
  }

  public getAllCompanies(account_id: number): Observable<any> {
    return this.http
      .get(`${GateApiService.GET_COMPANIES_API}?all_companies=true&account_id=${account_id}`)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  public getAllCompanyGroups(account_id?: number): Observable<FilteredGroupsResponse> {
    const params = { all_groups: 'true' };
    if (!!account_id && account_id > 0) params['account_id'] = account_id.toString();
    return this.http.get<FilteredGroupsResponse>(`${GateApiService.GET_COMPANIES_GROUPS_API}`, {
      params: { ...params },
    });
  }

  public getFilteredGroups(term: string): Observable<any> {
    return this.http.get(`${GateApiService.GET_COMPANIES_GROUPS_API}?term=${term}`).pipe(
      map(res => {
        (res as FilteredGroupsResponse).companies.map(c => (c.selected = false));
        return res;
      }),
    );
  }

  public getInvoicesCount(vendorIds: number[]): Observable<any> {
    return this.http.post(`${GateApiService.VENDOR_INVOICES_COUNT}`, {
      vendor_ids: vendorIds,
    });
  }

  public getInvoiceDataById(params: {
    id: string;
    accountId?: number;
  }): Observable<GetInvoiceByIdServerBody> {
    return this.http
      .get(`${GateApiService.INVOICE_API}/${params.id}?account_id=${params.accountId}`, httpOptions)
      .pipe(
        map((res: GetInvoiceByIdServerBody) => {
          return res;
        }),
      );
  }

  public getFieldsOptionsByInvoiceId(params: object): Observable<GetFieldsOptionsServerBody> {
    return this.http
      .get(`${GateApiService.INVOICE_API}/${params['id']}/options`, {
        ...httpOptions,
        params: { ...params },
      })
      .pipe(
        map((res: GetFieldsOptionsServerBody) => {
          return res;
        }),
      );
  }

  public putUpdateInvoice(
    id: string,
    body: InvoicesPutInvoiceBody,
  ): Observable<PutInvoiceResponseBody> {
    return this.http.put(`${GateApiService.INVOICE_API}/${id}`, body, httpOptions).pipe(
      map((res: PutInvoiceResponseBody) => {
        return res;
      }),
    );
  }

  public putValidateInvoice(
    id: string,
    body: InvoicesPutInvoiceBody,
  ): Observable<PutInvoiceResponseBody> {
    return this.http.put(`${GateApiService.INVOICE_API}/${id}/validate`, body, httpOptions).pipe(
      map((res: PutInvoiceResponseBody) => {
        return res;
      }),
    );
  }

  public getIsVatReg(params: VatRegServerParams) {
    return this.http
      .get(`${GateApiService.INVOICE_API}/${params.id}/is_vat_reg`, {
        ...httpOptions,
        params: { ...params },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(map((res: VatRegServerResponse) => res));
  }

  public getReclaimsList(params): Observable<ReclaimListServerResponse> {
    return this.http
      .post<ReclaimListServerResponse>(`${GateApiService.RECLAIMS_BASE}`, { ...params })
      .pipe(
        map((res: ReclaimListServerResponse) => {
          return res;
        }),
      );
  }

  public getReclaimsListCounts(filterValues): Observable<ReclaimListCountsServer> {
    return this.http.post<ReclaimListCountsServer>(GateApiService.RECLAIMS_COUNTS, {
      ...filterValues,
    });
  }

  public getInvoicesListCounts(filterValues): Observable<InvoiceListCountsServer> {
    return this.http.post<InvoiceListCountsServer>(`${GateApiService.INVOICES_COUNTS}`, {
      ...filterValues,
    });
  }

  public getReclaimData(params): Observable<ReclaimShowItemServer> {
    return this.http.get<ReclaimShowItemServer>(`${GateApiService.RECLAIMS_BASE}/${params.id}`, {
      params: params,
    });
  }

  public getReclaimInvoices(params): Observable<any> {
    return this.http.get(`${GateApiService.RECLAIMS_BASE}/${params.id}/invoices`, {
      params: params,
    });
  }

  public getUserTopLevelCompany(): Observable<UserCompany> {
    return this.http.get<UserCompany>(GateApiService.TOP_LEVEL_COMPANY);
  }

  public updateInvoiceReviewedByCS(params: {
    id: number;
    accountId: number;
  }): Observable<{ reviewed_by_cs: boolean }> {
    return this.http.post<{ reviewed_by_cs: boolean }>(
      `${GateApiService.INVOICE_API}/${params.id}/review_by_cs`,
      { account_id: params.accountId },
    );
  }

  public getImaginaryIdsByReason(queryParams: TaxTailorImaginaryIdsParams): Observable<any> {
    return this.http.get(GateApiService.IMAGINARY_IDS_BY_REASON, {
      params: { ...queryParams },
      ...httpOptions,
    });
  }

  public getTaxTailorEntities(queryParams: TaxTailorEntitiesParams): Observable<any> {
    return this.http.get(GateApiService.TAX_TAILOR_ENTITIES, {
      params: { ...queryParams },
      ...httpOptions,
    }).pipe(map((response: {entities: any[]}) => response.entities));
  }

  public reclaimsExportCsv(params) {
    return this.http.post(`${GateApiService.RECLAIMS_BASE}/export`, params, { responseType: 'blob' });
  }
}
