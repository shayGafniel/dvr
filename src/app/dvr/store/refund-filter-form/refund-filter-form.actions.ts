import { Action } from '@ngrx/store';

import { MultiSelectOption } from '../../../common/models/multy-select.model';

export enum RefundFilterFormActionTypes {
  FillCountry = '[RefundFilterForm] Fill Country',
  ResetRefundFilterForm = '[RefundFilterForm] Reset Refund Filter Form',
  SetCountryFilter = '[RefundFilterForm] Set Country Filter',
}

export class FillCountry implements Action {
  public readonly type = RefundFilterFormActionTypes.FillCountry;

  constructor(public payload: { country: MultiSelectOption }) {}
}

export class ResetRefundFilterForm implements Action {
  public readonly type = RefundFilterFormActionTypes.ResetRefundFilterForm;
}

export class SetCountryFilter implements Action {
  public readonly type = RefundFilterFormActionTypes.SetCountryFilter;

  constructor(public payload: { countryFilter: string }) {}
}

export type RefundFilterFormActions = FillCountry | ResetRefundFilterForm | SetCountryFilter;
