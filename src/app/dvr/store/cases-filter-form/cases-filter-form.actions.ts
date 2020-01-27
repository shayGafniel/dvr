import { Action } from '@ngrx/store';
import { SetValueAction } from 'ngrx-forms';

import { CasesFilterFormValue } from './cases-filter-form.state';
import { TimeFrame } from '../../../common/models/time-frame.model';
import { ApproveStatus } from '../../models/dvr.model';

export enum CasesFilterFormActionTypes {
  FillCasesFilterForm = '[CasesFilterForm] Fill Cases Filter Form',
  FillEntities = '[CasesFilterForm] Fill Entities',
  FillStatus = '[CasesFilterForm] Fill Status',
  FillTimeSelect = '[CasesFilterForm] Fill Time Select',
  ResetCasesFilterForm = '[CasesFilterForm] Reset CasesFilter Form',
}

export class FillCasesFilterForm implements Action {
  public readonly type = CasesFilterFormActionTypes.FillCasesFilterForm;

  constructor(public payload: Partial<CasesFilterFormValue>) {}
}

export class FillEntities implements Action {
  public readonly type = CasesFilterFormActionTypes.FillEntities;

  constructor(public payload: { entities: string[] }) {}
}

export class FillStatus implements Action {
  public readonly type = CasesFilterFormActionTypes.FillStatus;

  constructor(public payload: { status: ApproveStatus }) {}
}

export class FillTimeSelect implements Action {
  public readonly type = CasesFilterFormActionTypes.FillTimeSelect;

  constructor(public payload: { timeFrame: TimeFrame }) {}
}

export class ResetCasesFilterForm implements Action {
  public readonly type = CasesFilterFormActionTypes.ResetCasesFilterForm;
}

export type CasesFilterFormActions =
  | FillCasesFilterForm
  | FillEntities
  | FillStatus
  | FillTimeSelect
  | ResetCasesFilterForm
  | SetValueAction<any>;
