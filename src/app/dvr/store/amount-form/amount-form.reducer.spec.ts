import { SetValueAction } from 'ngrx-forms';

import * as fromActions from './amount-form.actions';
import {
  amountFormReducer,
  FORM_ID,
  initialFormState,
  minValue,
  reducer,
  selectAmount,
  selectAmountAsString,
  selectAmountFromTo,
  selectMod,
  State,
} from './amount-form.reducer';
import { AmountMod } from './amount-form.state';

export const amount = minValue;
export const mod = initialFormState.value.mod;

function getFilledAmountState(state = initialFormState, customAmount = amount): State {
  return reducer(state, new fromActions.FillAmount({ amount: customAmount }));
}

function getFilledModState(state = initialFormState, customMod = mod): State {
  return reducer(state, new fromActions.FillMod({ mod: customMod }));
}

describe('AmountForm Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialFormState, action);

      expect(result).toEqual({
        ...initialFormState,
        ...amountFormReducer(initialFormState, action),
      });
    });
  });

  describe('FillAmount', () => {
    it('should fill amount field', () => {
      const action = new fromActions.FillAmount({ amount });

      const result = reducer(initialFormState, action);

      expect(result.value.amount).toEqual(amount);
    });
  });

  describe('FillMod', () => {
    it('should fill mod field', () => {
      const action = new fromActions.FillMod({ mod });

      const result = reducer(initialFormState, action);

      expect(result.value.mod).toEqual(mod);
    });
  });

  describe('SetValue', () => {
    it('should set initial value if invalid data', () => {
      const action = new SetValueAction(`${FORM_ID}.amount`, minValue - 1);

      const result = reducer(initialFormState, action as any);

      expect(result.value.amount).toEqual(initialFormState.value.amount);
    });
  });

  describe('ResetAmountForm', () => {
    it('should reset the form to initial value', () => {
      const action = new fromActions.ResetAmountForm();

      const result = reducer(getFilledAmountState(), action);

      expect(result).toEqual(initialFormState);
    });
  });

  describe('selectAmount', () => {
    it('should return amount value', () => {
      const state = getFilledAmountState();

      expect(selectAmount(state)).toBe(amount);
    });
  });

  describe('selectAmountAsString', () => {
    it('should return amountFrom value as a string', () => {
      const state = getFilledAmountState();

      expect(selectAmountAsString(state)).toBe(amount.toString());
    });

    it('should return a string if value is null', () => {
      const state = getFilledAmountState(initialFormState, null);

      expect(selectAmountAsString(state)).toBe('');
    });
  });

  describe('selectMod', () => {
    it('should return mod value', () => {
      const state = getFilledModState();

      expect(selectMod(state)).toBe(mod);
    });
  });

  describe('selectAmountFromTo', () => {
    const amountValue = 42;
    const amountValueString = amountValue.toString();

    it('should return FromTo value for Less mod', () => {
      const amountMod = AmountMod.Less;

      expect(selectAmountFromTo(amountValueString, amountMod)).toEqual({
        from: '0',
        to: amountValueString,
      });
    });

    it('should return FromTo value for Greater mod', () => {
      const amountMod = AmountMod.Greater;

      expect(selectAmountFromTo(amountValueString, amountMod)).toEqual({
        from: amountValueString,
        to: null,
      });
    });
  });
});
