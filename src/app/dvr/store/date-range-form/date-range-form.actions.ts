import { Action } from '@ngrx/store';

import { RangeValue } from '../../models/dvr.model';

export enum DateRangeFormActionTypes {
  DisableDateRange = '[DateRangeForm] Disable Date Range',
  EnableDateRange = '[DateRangeForm] Enable Date Range',
  FillDateRange = '[DateRangeForm] Fill Date Range',
  InitDateRanges = '[DateRangeForm] Init Date Ranges',
  ResetDateRange = '[DateRangeForm] Reset Date Range',
}

export class DisableDateRange implements Action {
  public readonly type = DateRangeFormActionTypes.DisableDateRange;

  constructor(public payload: { accountId: number; entityId: string }) {}
}

export class EnableDateRange implements Action {
  public readonly type = DateRangeFormActionTypes.EnableDateRange;

  constructor(public payload: { accountId: number; entityId: string }) {}
}

export class FillDateRange implements Action {
  public readonly type = DateRangeFormActionTypes.FillDateRange;

  constructor(public payload: { accountId: number; entityId: string; range: RangeValue }) {}
}

export class InitDateRanges implements Action {
  public readonly type = DateRangeFormActionTypes.InitDateRanges;

  constructor(public payload: { accountId: number; entityIds: string[] }) {}
}

export class ResetDateRange implements Action {
  public readonly type = DateRangeFormActionTypes.ResetDateRange;

  constructor(public payload: { accountId: number; entityId: string }) {}
}

export type DateRangeFormActions =
  | DisableDateRange
  | EnableDateRange
  | FillDateRange
  | InitDateRanges
  | ResetDateRange;
