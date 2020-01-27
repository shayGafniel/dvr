import { Action } from '@ngrx/store';

import { BulkCompaniesInfo } from '../../../models/deadcart.model';

export enum DeadcartActionTypes {
  GetBulkCompaniesInfo = '[API] [Deadcart] Get Bulk Companies Info',
  GetBulkCompaniesInfoSuccess = '[API] [Deadcart] Get Bulk Companies Info Success',
  GetBulkCompaniesInfoFail = '[API] [Deadcart] Get Bulk Companies Info Fail',
  LoadBulkCompaniesInfo = '[Deadcart] Load Bulk Companies Info',
}

/* GetBulkCompaniesInfo */

export class GetBulkCompaniesInfo implements Action {
  public readonly type = DeadcartActionTypes.GetBulkCompaniesInfo;
}

export class GetBulkCompaniesInfoSuccess implements Action {
  public readonly type = DeadcartActionTypes.GetBulkCompaniesInfoSuccess;
}

export class GetBulkCompaniesInfoFail implements Action {
  public readonly type = DeadcartActionTypes.GetBulkCompaniesInfoFail;

  constructor(public payload: any) {}
}

/* LoadBulkCompaniesInfo */

export class LoadBulkCompaniesInfo implements Action {
  public readonly type = DeadcartActionTypes.LoadBulkCompaniesInfo;

  constructor(public payload: { bulkCompaniesInfo: BulkCompaniesInfo }) {}
}

export type DeadcartActions =
  | GetBulkCompaniesInfo
  | GetBulkCompaniesInfoSuccess
  | GetBulkCompaniesInfoFail
  | LoadBulkCompaniesInfo;
