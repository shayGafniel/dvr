import { box } from 'ngrx-forms';

import { FillCountry } from './refund-filter-form.actions';
import * as fromActions from './refund-filter-form.actions';
import {
  initialFormState,
  reducer,
  refundFilterFormReducer,
  selectCountry,
  selectCountryFilter,
  State,
} from './refund-filter-form.reducer';
import { MultiSelectOption } from '../../../common/models/multy-select.model';

export const country: MultiSelectOption = { display: 'France', value: 'FR' };

const countryFilter = 'an';

function getFilledCountryState(state = initialFormState): State {
  return reducer(state, new FillCountry({ country }));
}

describe('RefundFilterForm Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialFormState, action);

      expect(result).toEqual({
        ...initialFormState,
        ...refundFilterFormReducer(initialFormState, action),
      });
    });
  });

  describe('FillCountry', () => {
    it('should fill country field', () => {
      const action = new fromActions.FillCountry({ country });

      const result = reducer(initialFormState, action);

      expect(result.value.country).toEqual(box(country));
    });
  });

  describe('ResetRefundFilterForm', () => {
    it('should set initial state', () => {
      const state = getFilledCountryState();
      const action = new fromActions.ResetRefundFilterForm();

      const result = reducer(state, action);

      expect(result).toEqual({ ...initialFormState });
    });
  });

  describe('SetCountryFilter', () => {
    it('should set field countryFilter', () => {
      const action = new fromActions.SetCountryFilter({ countryFilter });

      const result = reducer(initialFormState, action);

      expect(result).toEqual({ ...initialFormState, userDefinedProperties: { countryFilter } });
    });
  });

  describe('selectCountry', () => {
    it('should return country value', () => {
      const state = getFilledCountryState();

      expect(selectCountry(state)).toEqual(country.value);
    });
  });

  describe('selectCountryFilter', () => {
    it('should return countryFilter', () => {
      const state = { ...initialFormState, userDefinedProperties: { countryFilter } };

      expect(selectCountryFilter(state)).toEqual(countryFilter);
    });
  });
});
