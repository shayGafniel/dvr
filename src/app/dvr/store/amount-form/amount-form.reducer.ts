import { isNil } from 'lodash-es';
import {
  createFormGroupState,
  createFormStateReducerWithUpdate,
  FormGroupState,
  setValue,
  updateGroup,
  validate,
} from 'ngrx-forms';
import { greaterThanOrEqualTo, pattern } from 'ngrx-forms/validation';

import { AmountFormActions, AmountFormActionTypes } from './amount-form.actions';
import { AmountFormValue, AmountMod, FromTo } from './amount-form.state';

export const FORM_ID = 'amountForm';

export const initialFormState = createFormGroupState<AmountFormValue>(FORM_ID, {
  amount: 0,
  mod: AmountMod.Greater,
});

export const minValue = 0;

export interface State extends FormGroupState<AmountFormValue> {}

export const amountFormReducer = createFormStateReducerWithUpdate<AmountFormValue>(
  updateGroup<AmountFormValue>([
    {
      amount: validate<number>([greaterThanOrEqualTo(minValue)]),
      mod: validate<string>([pattern(new RegExp(`${AmountMod.Greater}|${AmountMod.Less}`))]),
    },
    {
      amount: amount =>
        amount.isInvalid ? setValue(amount, initialFormState.value.amount) : amount,
      mod: mod => (mod.isInvalid ? setValue(mod, initialFormState.value.mod) : mod),
    },
  ]),
);

export function reducer(state = initialFormState, action: AmountFormActions): State {
  const amountForm = amountFormReducer(state, action);
  if (amountForm !== state) {
    state = { ...state, ...amountForm };
  }

  switch (action.type) {
    case AmountFormActionTypes.FillAmount:
      return updateGroup<AmountFormValue>({
        amount: amount => setValue(amount, action.payload.amount),
      })(state);

    case AmountFormActionTypes.FillMod:
      return updateGroup<AmountFormValue>({
        mod: mod => setValue(mod, action.payload.mod),
      })(state);

    case AmountFormActionTypes.ResetAmountForm:
      return initialFormState;

    default:
      return state;
  }
}

export const selectAmount = (state: State): number => state.value.amount;

export const selectAmountAsString = (state: State): string =>
  isNil(selectAmount(state)) ? '' : selectAmount(state).toString();

export const selectMod = (state: State): AmountMod => state.value.mod;

export const selectAmountFromTo = (amount: string, mod: AmountMod): FromTo => {
  switch (mod) {
    case AmountMod.Less:
      return {
        from: '0',
        to: amount,
      };

    case AmountMod.Greater:
      return {
        from: amount,
        to: null,
      };

    default:
      throw new TypeError(`Unrecognized amount mod '${mod}'`);
  }
};
