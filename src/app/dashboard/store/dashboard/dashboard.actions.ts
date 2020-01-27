import { Action } from '@ngrx/store';

import { Dashboard } from '../../models/dashboard.model';
import { DashboardGraphsResponse } from '../../models/dashboard-graphs.model';
import { DashboardPromotions } from '~/dashboard/models/dashboard-promotions.model';
import { DashboardTopRow } from '~/dashboard/models/dashboard-top-row.model';

export enum DashboardActionTypes {
  GetDashboard = '[API] [Dashboard] Get Dashboard',
  GetDashboardSuccess = '[API] [Dashboard] Get Dashboard Success',
  GetDashboardFail = '[API] [Dashboard] Get Dashboard Fail',
  GetDashboardGraphs = '[API] [Dashboard] Get Dashboard Graphs',
  GetDashboardGraphsSuccess = '[API] [Dashboard] Get Dashboard Graphs Success',
  GetDashboardGraphsFail = '[API] [Dashboard] Get Dashboard Graphs Fail',
  GetDashboardPromotions = '[API][Dashboard] Get Dashboard Promotions',
  GetDashboardPromotionsSuccess = '[API][Dashboard] Get Dashboard Promotions Success',
  GetDashboardPromotionsFail = '[API][Dashboard] Get Dashboard Promotions Fail',
  GetDashboardTopRow = '[API] [Dashboard] Get Dashboard Top Row',
  GetDashboardTopRowSuccess = '[API] [Dashboard] Get Dashboard Top Row Success',
  GetDashboardTopRowFail = '[API] [Dashboard] Get Dashboard Top Row Fail',
  LoadDashboard = '[Dashboard] Load Dashboard',
  LoadDashboardGraphs = '[Dashboard] Load Dashboard Graphs',
  LoadDashboardPromotions = '[Dashboard] Load Dashboard Promotions',
  LoadDashboardTopRow = '[Dashboard] Load Dashboard Top Row',
}

/* GetDashboard */

export class GetDashboard implements Action {
  public readonly type = DashboardActionTypes.GetDashboard;
}

export class GetDashboardSuccess implements Action {
  public readonly type = DashboardActionTypes.GetDashboardSuccess;
}

export class GetDashboardFail implements Action {
  public readonly type = DashboardActionTypes.GetDashboardFail;

  constructor(public payload: any) {}
}

/* GetDashboardGraphs */

export class GetDashboardGraphs implements Action {
  public readonly type = DashboardActionTypes.GetDashboardGraphs;
}

export class GetDashboardGraphsSuccess implements Action {
  public readonly type = DashboardActionTypes.GetDashboardGraphsSuccess;
}

export class GetDashboardGraphsFail implements Action {
  public readonly type = DashboardActionTypes.GetDashboardGraphsFail;

  constructor(public payload: any) {}
}

/* GetDashboardPromotions */

export class GetDashboardPromotions implements Action {
  public readonly type = DashboardActionTypes.GetDashboardPromotions;
}

export class GetDashboardPromotionsSuccess implements Action {
  public readonly type = DashboardActionTypes.GetDashboardPromotionsSuccess;
}

export class GetDashboardPromotionsFail implements Action {
  public readonly type = DashboardActionTypes.GetDashboardPromotionsFail;

  constructor(public payload: any) {}
}

/* GetDashboardTopRow */

export class GetDashboardTopRow implements Action {
  public readonly type = DashboardActionTypes.GetDashboardTopRow;
}

export class GetDashboardTopRowSuccess implements Action {
  public readonly type = DashboardActionTypes.GetDashboardTopRowSuccess;
}

export class GetDashboardTopRowFail implements Action {
  public readonly type = DashboardActionTypes.GetDashboardTopRowFail;

  constructor(public payload: any) {}
}

/* LoadDashboard */

export class LoadDashboard implements Action {
  public readonly type = DashboardActionTypes.LoadDashboard;

  constructor(public payload: { dashboard: Dashboard }) {}
}

/* LoadDashboardGraphs */

export class LoadDashboardGraphs implements Action {
  public readonly type = DashboardActionTypes.LoadDashboardGraphs;

  constructor(public payload: { dashboardGraphs: DashboardGraphsResponse }) {}
}

/* LoadDashboardPromotions */

export class LoadDashboardPromotions implements Action {
  public readonly type = DashboardActionTypes.LoadDashboardPromotions;

  constructor(public payload: { dashboardPromotions: DashboardPromotions }) {}
}

/* LoadDashboardTopRow */

export class LoadDashboardTopRow implements Action {
  public readonly type = DashboardActionTypes.LoadDashboardTopRow;

  constructor(public payload: { dashboardTopRow: DashboardTopRow }) {}
}

export type DashboardActions =
  | GetDashboard
  | GetDashboardSuccess
  | GetDashboardFail
  | GetDashboardGraphs
  | GetDashboardGraphsSuccess
  | GetDashboardGraphsFail
  | GetDashboardPromotions
  | GetDashboardPromotionsSuccess
  | GetDashboardPromotionsFail
  | GetDashboardTopRow
  | GetDashboardTopRowSuccess
  | GetDashboardTopRowFail
  | LoadDashboard
  | LoadDashboardGraphs
  | LoadDashboardPromotions
  | LoadDashboardGraphs
  | LoadDashboardTopRow;
