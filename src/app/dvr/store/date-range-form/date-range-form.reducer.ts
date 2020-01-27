import { isEmpty } from 'lodash-es';
import {
  createFormGroupState,
  createFormStateReducerWithUpdate,
  disable,
  enable,
  FormGroupState,
  setValue,
  updateGroup,
} from 'ngrx-forms';

import { DateRangeFormActions, DateRangeFormActionTypes } from './date-range-form.actions';
import { DvrHelper } from '../../helpers/dvr.helper';
import { IsDisabledEntities, RangeValue } from '../../models/dvr.model';

export interface DateRangeFormValue {
  dateRanges: {
    [accountId: number]: {
      [entityId: string]: RangeValue;
    };
  };
}

const FORM_ID = 'dateRangeForm';

export const initialFormState = createFormGroupState<DateRangeFormValue>(FORM_ID, {
  dateRanges: {},
});

export interface State extends FormGroupState<DateRangeFormValue> {}

export const dateRangeFormReducer = createFormStateReducerWithUpdate<DateRangeFormValue>(
  updateGroup<DateRangeFormValue>({}),
);

export function reducer(state = initialFormState, action: DateRangeFormActions): State {
  const dateRangeForm = dateRangeFormReducer(state, action);
  if (dateRangeForm !== state) {
    state = { ...state, ...dateRangeForm };
  }

  switch (action.type) {
    case DateRangeFormActionTypes.DisableDateRange:
      return updateGroup<DateRangeFormValue>({
        dateRanges: dateRanges => {
          const { accountId, entityId } = action.payload;
          const dateRangeControl = disable(dateRanges.controls[accountId].controls[entityId]);

          return {
            ...dateRanges,
            controls: {
              ...dateRanges.controls,
              [accountId]: {
                ...dateRanges.controls[accountId],
                controls: {
                  ...dateRanges.controls[accountId].controls,
                  [entityId]: dateRangeControl,
                },
              },
            },
          };
        },
      })(state);

    case DateRangeFormActionTypes.EnableDateRange:
      return updateGroup<DateRangeFormValue>({
        dateRanges: dateRanges => {
          const { accountId, entityId } = action.payload;
          const dateRangeControl = enable(dateRanges.controls[accountId].controls[entityId]);

          return {
            ...dateRanges,
            controls: {
              ...dateRanges.controls,
              [accountId]: {
                ...dateRanges.controls[accountId],
                controls: {
                  ...dateRanges.controls[accountId].controls,
                  [entityId]: dateRangeControl,
                },
              },
            },
          };
        },
      })(state);

    case DateRangeFormActionTypes.FillDateRange:
      return updateGroup<DateRangeFormValue>({
        dateRanges: dateRanges => {
          const { accountId, entityId, range } = action.payload;

          return setValue(dateRanges, {
            ...dateRanges.value,
            [accountId]: {
              ...dateRanges.value[accountId],
              [entityId]: range,
            },
          });
        },
      })(state);

    case DateRangeFormActionTypes.InitDateRanges:
      return updateGroup<DateRangeFormValue>({
        dateRanges: dateRanges => {
          const { accountId, entityIds } = action.payload;

          const entities = entityIds.reduce(
            (accumulator, entityId) => ({
              ...accumulator,
              [entityId]: DvrHelper.getEmptyDateRange(),
            }),
            {},
          );

          return setValue(dateRanges, {
            ...dateRanges.value,
            [accountId]: entities,
          });
        },
      })(state);

    case DateRangeFormActionTypes.ResetDateRange:
      return updateGroup<DateRangeFormValue>({
        dateRanges: dateRanges => {
          const { accountId, entityId } = action.payload;

          return setValue(dateRanges, {
            ...dateRanges.value,
            [accountId]: {
              ...dateRanges.value[accountId],
              [entityId]: DvrHelper.getEmptyDateRange(),
            },
          });
        },
      })(state);

    default:
      return state;
  }
}

const selectRangeValue = (state: State, accountId: number, entityId: string): RangeValue => {
  return state.value.dateRanges[accountId][entityId];
};

export const selectEnd = (state: State, accountId: number, entityId: string): string => {
  if (
    !accountId ||
    !entityId ||
    isEmpty(state.value.dateRanges[accountId]) ||
    isEmpty(state.value.dateRanges[accountId][entityId])
  ) {
    return '';
  }

  return DvrHelper.getFormattedDate(selectRangeValue(state, accountId, entityId).end);
};

export const selectIsDisabledEntities = (state: State, accountId: number): IsDisabledEntities => {
  if (isEmpty(state.value.dateRanges[accountId])) {
    return {};
  }

  return Object.entries(state.controls.dateRanges.controls[accountId].controls).reduce(
    (isDisabledEntities: IsDisabledEntities, [id, dateRange]) => ({
      ...isDisabledEntities,
      [id]: dateRange.isDisabled,
    }),
    {},
  );
};

export const selectStart = (state: State, accountId: number, entityId: string): string => {
  if (
    !accountId ||
    !entityId ||
    isEmpty(state.value.dateRanges[accountId]) ||
    isEmpty(state.value.dateRanges[accountId][entityId])
  ) {
    return '';
  }

  return DvrHelper.getFormattedDate(selectRangeValue(state, accountId, entityId).start);
};
