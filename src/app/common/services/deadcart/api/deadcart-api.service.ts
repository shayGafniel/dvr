import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi, HTTP_NO_CONTENT, ServerErrorResponse } from '../../../contracts/base-api';
import { BulkCompaniesInfo, DeadcartCompanyInfoResponse } from '../../../models/deadcart.model';

@Injectable()
export class DeadcartApiService extends BaseApi {
  public static VATBOX_SERVICE_NAME = 'deadcart';
  public static API_BASE = `/api/${DeadcartApiService.VATBOX_SERVICE_NAME}/v1.0`;
  public static DEADCART_COMPANY_INFO_GET_API = `${DeadcartApiService.API_BASE}/companyInfo`;
  public static DEADCART_BULK_COMPANY_INFO_GET_API = `${
    DeadcartApiService.API_BASE
  }/bulkCompanyInfo`;

  constructor(http: HttpClient) {
    super(http);
  }

  public getCompanyInfo(companyId: string): Observable<DeadcartCompanyInfoResponse> {
    return this.responseToServerResponse<DeadcartCompanyInfoResponse, ServerErrorResponse>(
      this.http.get(`${DeadcartApiService.DEADCART_COMPANY_INFO_GET_API}`, {
        observe: 'response',
        params: {
          companyId: companyId,
        },
      }),
      (res, resJson) => {
        if (res.status === HTTP_NO_CONTENT) {
          return;
        }
        return {
          // As For Now Deadcart response is a plain text (and not a json).
          // When Deadcart service will refactor to return a json
          // this code (api) and the mock code should be refactor as well to handle json (and not plain text)
          info: resJson,
        };
      },
    );
  }

  public getBulkCompaniesInfo(companiesIds: string[]): Observable<BulkCompaniesInfo> {
    return this.http.post<BulkCompaniesInfo>(
      DeadcartApiService.DEADCART_BULK_COMPANY_INFO_GET_API,
      { ids: companiesIds },
    );
  }
}
