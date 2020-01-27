import { FormGroupState } from 'ngrx-forms';

export enum AmountMod {
  Greater = 'greater',
  Less = 'less',
}

export interface AmountFormValue {
  amount: number | null;
  mod: AmountMod;
}

export interface State extends FormGroupState<AmountFormValue> {}

export interface FromTo {
  from: string;
  to: string;
}
