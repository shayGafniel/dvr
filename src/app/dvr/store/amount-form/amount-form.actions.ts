import { Action } from '@ngrx/store';

import { AmountMod } from './amount-form.state';

export enum AmountFormActionTypes {
  FillAmount = '[AmountForm] Fill Amount',
  FillMod = '[AmountForm] Fill Mod',
  ResetAmountForm = '[AmountForm] Reset Amount Form',
}

export class FillAmount implements Action {
  public readonly type = AmountFormActionTypes.FillAmount;

  constructor(public payload: { amount: number }) {}
}

export class FillMod implements Action {
  public readonly type = AmountFormActionTypes.FillMod;

  constructor(public payload: { mod: AmountMod }) {}
}

export class ResetAmountForm implements Action {
  public readonly type = AmountFormActionTypes.ResetAmountForm;
}

export type AmountFormActions = FillAmount | FillMod | ResetAmountForm;
