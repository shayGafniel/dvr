import {
  box,
  Boxed,
  createFormGroupState,
  createFormStateReducerWithUpdate,
  FormGroupState,
  setValue,
  unbox,
  updateGroup,
  validate,
} from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

import { RefundFilterFormActions, RefundFilterFormActionTypes } from './refund-filter-form.actions';
import { MultiSelectOption } from '../../../common/models/multy-select.model';

export interface RefundFilterFormValue {
  country: Boxed<MultiSelectOption>;
}

const FORM_ID = 'refundFilterForm';

export const initialFormState = createFormGroupState<RefundFilterFormValue>(FORM_ID, {
  country: box({ display: '', value: '' }),
});

export interface State extends FormGroupState<RefundFilterFormValue> {}

export const refundFilterFormReducer = createFormStateReducerWithUpdate<RefundFilterFormValue>(
  updateGroup<RefundFilterFormValue>({
    country: validate(required),
  }),
);

export function reducer(state = initialFormState, action: RefundFilterFormActions): State {
  const refundFilterForm = refundFilterFormReducer(state, action);
  if (refundFilterForm !== state) {
    state = { ...state, ...refundFilterForm };
  }

  switch (action.type) {
    case RefundFilterFormActionTypes.FillCountry:
      return updateGroup<RefundFilterFormValue>({
        country: country => setValue(country, box(action.payload.country)),
      })(state);

    case RefundFilterFormActionTypes.ResetRefundFilterForm:
      return { ...initialFormState };

    case RefundFilterFormActionTypes.SetCountryFilter:
      return { ...state, userDefinedProperties: { countryFilter: action.payload.countryFilter } };

    default:
      return state;
  }
}

export const selectCountry = (state: State): string => unbox(state.value.country).value;

export const selectCountryFilter = (state: State): string => {
  return state.userDefinedProperties.countryFilter || '';
};
