import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseApi } from '../../../common/contracts/base-api';
import { DvrHelper } from '../../helpers/dvr.helper';
import { CasesFilter, CasesResponse } from '../../models/case.model';
import {
  AccountEntity,
  Approve,
  CreateDraftResponse,
  Draft,
  DvrStatistics,
  RangeValue,
  Refund,
  RefundsRequest,
} from '../../models/dvr.model';

@Injectable()
export class DvrApiService extends BaseApi {
  public static VATBOX_SERVICE_NAME = 'dvr';
  public static API_BASE = `/api/${DvrApiService.VATBOX_SERVICE_NAME}/v1.0`;
  public static ACCOUNTS_API = `${DvrApiService.API_BASE}/accounts`;
  public static APPROVES_API = `${DvrApiService.API_BASE}/approves`;
  public static DRAFT_API = `${DvrApiService.API_BASE}/drafts`;

  constructor(http: HttpClient) {
    super(http);
  }

  public createDraft(draft: Draft): Observable<CreateDraftResponse> {
    return this.http.post<CreateDraftResponse>(`${DvrApiService.DRAFT_API}`, draft);
  }

  public doApprove(hash: string, approvedBy: string): Observable<Approve> {
    return this.http.put<Approve>(`${DvrApiService.APPROVES_API}/${hash}`, '', {
      params: { approvedBy },
    });
  }

  public getAccountStatistics(id: number): Observable<DvrStatistics> {
    return this.http.get<DvrStatistics>(`${DvrApiService.ACCOUNTS_API}/${id}/statistics`);
  }

  public getApprove(hash: string): Observable<Approve> {
    const url = `${DvrApiService.APPROVES_API}/${hash}`;

    return this.http
      .get<Approve>(url)
      .pipe(
        map(approve => ({ ...approve, refunds: DvrHelper.addIdToRefunds(approve.refunds, url) })),
      );
  }

  public getCases(id: number, params: CasesFilter): Observable<CasesResponse> {
    const url = `${DvrApiService.ACCOUNTS_API}/${id}/cases`;

    if (params.end || params.start) {
      DvrHelper.validateRange({ end: params.end, start: params.start });
    }

    return this.http.get<CasesResponse>(url, {
      params: DvrHelper.getPreparedParams(params as { [key: string]: string | string[] }),
    });
  }

  public getEntityStatistics(
    accountId: number,
    entityId: string,
    range: RangeValue,
  ): Observable<DvrStatistics> {
    return this.http.get<DvrStatistics>(
      `${DvrApiService.ACCOUNTS_API}/${accountId}/entities/${entityId}/statistics`,
      { params: DvrHelper.getPreparedParams({ ...range }) },
    );
  }

  public getRefunds(refundsRequest: RefundsRequest): Observable<Refund[]> {
    const {
      accountId,
      entityId,
      params: { end, start },
    } = refundsRequest;
    const url = `${DvrApiService.ACCOUNTS_API}/${accountId}/entities/${entityId}/refunds`;

    DvrHelper.validateRange({ end, start });

    return this.http
      .get<Refund[]>(url, {
        params: DvrHelper.getPreparedParams(refundsRequest.params),
      })
      .pipe(map(refunds => DvrHelper.addIdToRefunds(refunds, url)));
  }

  public removeCase(id: number, hash: string): Observable<any> {
    return this.http.delete(`${DvrApiService.ACCOUNTS_API}/${id}/cases/${hash}`);
  }
}
