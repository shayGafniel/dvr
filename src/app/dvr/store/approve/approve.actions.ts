import { Action } from '@ngrx/store';

import { Approve } from '../../models/dvr.model';

export enum ApproveActionTypes {
  DoApprove = '[API] [Approve] Do Approve',
  DoApproveSuccess = '[API] [Approve] Do Approve Success',
  DoApproveFail = '[API] [Approve] Do Approve Fail',
  GetApprove = '[API] [Approve] Get Approve',
  GetApproveSuccess = '[API] [Approve] Get Approve Success',
  GetApproveFail = '[API] [Approve] Get Approve Fail',
  GetRefunds = '[API] [Approve] Get Refunds',
  GetRefundsSuccess = '[API] [Approve] Get Refunds Success',
  GetRefundsFail = '[API] [Approve] Get Refunds Fail',
  LoadApprove = '[Approve] Load Approve',
  SetApproveHash = '[Approve] Set Approve Hash',
  UpdateApprove = '[Approve] Update Approve',
}

/* DoApprove */

export class DoApprove implements Action {
  public readonly type = ApproveActionTypes.DoApprove;
}

export class DoApproveSuccess implements Action {
  public readonly type = ApproveActionTypes.DoApproveSuccess;
}

export class DoApproveFail implements Action {
  public readonly type = ApproveActionTypes.DoApproveFail;

  constructor(public payload: any) {}
}

/* GetApprove */

export class GetApprove implements Action {
  public readonly type = ApproveActionTypes.GetApprove;
}

export class GetApproveSuccess implements Action {
  public readonly type = ApproveActionTypes.GetApproveSuccess;
}

export class GetApproveFail implements Action {
  public readonly type = ApproveActionTypes.GetApproveFail;

  constructor(public payload: any) {}
}

/* GetRefunds */

export class GetRefunds implements Action {
  public readonly type = ApproveActionTypes.GetRefunds;
}

export class GetRefundsSuccess implements Action {
  public readonly type = ApproveActionTypes.GetRefundsSuccess;
}

export class GetRefundsFail implements Action {
  public readonly type = ApproveActionTypes.GetRefundsFail;

  constructor(public payload: any) {}
}

/* LoadApprove */

export class LoadApprove implements Action {
  public readonly type = ApproveActionTypes.LoadApprove;

  constructor(public payload: { approve: Approve; approveHash: string }) {}
}

/* SetApproveHash */

export class SetApproveHash implements Action {
  public readonly type = ApproveActionTypes.SetApproveHash;

  constructor(public payload: { approveHash: string }) {}
}

/* UpdateApprove */

export class UpdateApprove implements Action {
  public readonly type = ApproveActionTypes.UpdateApprove;

  constructor(public payload: { approve: Approve; approveHash: string }) {}
}

export type ApproveActions =
  | DoApprove
  | DoApproveSuccess
  | DoApproveFail
  | GetApprove
  | GetApproveSuccess
  | GetApproveFail
  | GetRefunds
  | GetRefundsSuccess
  | GetRefundsFail
  | LoadApprove
  | SetApproveHash
  | UpdateApprove;
