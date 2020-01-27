import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Dashboard,
  DashboardFilters,
  DashboardGraphsFilters,
  DashboardResponse,
  PromotionFilters,
} from '../../models/dashboard.model';
import { DashboardGraphsResponse } from '../../models/dashboard-graphs.model';
import {
  DashboardPromotions,
  DashboardPromotionsResponse,
} from '../../models/dashboard-promotions.model';
import {
  AnnualSpendData,
  AnnualSpendResponse,
  DashboardTopRow,
} from '../../models/dashboard-top-row.model';
import { CommonUtil } from '~/shared/utils/common.util';

@Injectable()
export class DashboardApiService {
  public static TABLEAU_SERVER_NAME = 'https://tableau-test.vatbox.com';
  public static VATBOX_SERVICE_NAME = 'dashboard';
  public static API_BASE = `/api/${DashboardApiService.VATBOX_SERVICE_NAME}/v1.0`;
  public static DASHBOARD_API = `${DashboardApiService.API_BASE}/amounts`;
  public static DASHBOARD_GRAPHS_API = `${DashboardApiService.API_BASE}/graphs`;
  public static DASHBOARD_PROMOTIONS_API = `${DashboardApiService.API_BASE}/promotion`;
  public static DASHBOARD_TOP_ROW_API = `${DashboardApiService.API_BASE}/top_row`;
  public static DASHBOARD_ANNUAL_SPEND = `${DashboardApiService.API_BASE}/annual_spend`;

  constructor(private http: HttpClient) {}

  public getDashboard(filters: DashboardFilters): Observable<Dashboard> {
    return this.http
      .post<DashboardResponse>(DashboardApiService.DASHBOARD_API, filters)
      .pipe(map(res => CommonUtil.keysToCamelCase<Dashboard>(res)));
  }

  public getDashboardGraphs(params: DashboardGraphsFilters): Observable<DashboardGraphsResponse> {
    return this.http.get<DashboardGraphsResponse>(DashboardApiService.DASHBOARD_GRAPHS_API, {
      params,
    });
  }

  public getDashboardPromotions(params: PromotionFilters): Observable<DashboardPromotions> {
    return this.http
      .get<DashboardPromotionsResponse>(DashboardApiService.DASHBOARD_PROMOTIONS_API, this.packPromotionParams(params))
      .pipe(map((res: DashboardPromotionsResponse) => this.promotionResponseToDashboard(res)));
  }

  private promotionResponseToDashboard = (
    response: DashboardPromotionsResponse,
  ): DashboardPromotions => ({
    vendorDirect: response.vendor_direct || 0,
    complianceTrainer: response.compliance_trainer || 0,
    taxTailor: response.dvr_potential || 0,
  });

  // *********** TOP ROW ***********

  public getDashboardTopRow(params: PromotionFilters): Observable<DashboardTopRow> {
    return this.http
      .get<DashboardTopRow>(DashboardApiService.DASHBOARD_TOP_ROW_API,  this.packPromotionParams(params)  );
  }

  public setAnnualSpend(annualSpendData: AnnualSpendData): Observable<AnnualSpendResponse> {
    return this.http.post<AnnualSpendResponse>(
      DashboardApiService.DASHBOARD_ANNUAL_SPEND,
      annualSpendData,
    );
  }


  private packPromotionParams(params: any): {params: HttpParams} {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      httpParams = httpParams.append(key, value);
    });
    return {params: httpParams};
  }
}
