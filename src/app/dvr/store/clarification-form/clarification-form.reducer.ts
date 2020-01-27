import {
  createFormGroupState,
  createFormStateReducerWithUpdate,
  disable,
  FormGroupState,
  setValue,
  updateGroup,
} from 'ngrx-forms';

import {
  ClarificationFormActions,
  ClarificationFormActionTypes,
} from './clarification-form.actions';

export interface ClarificationFormValue {
  clarifications: {
    [entityId: string]: string;
  };
}

const FORM_ID = 'clarificationForm';

export const initialFormState = createFormGroupState<ClarificationFormValue>(FORM_ID, {
  clarifications: {},
});

export interface State extends FormGroupState<ClarificationFormValue> {}

export const clarificationFormReducer = createFormStateReducerWithUpdate<ClarificationFormValue>(
  updateGroup<ClarificationFormValue>({}),
);

export function reducer(state = initialFormState, action: ClarificationFormActions): State {
  const clarificationForm = clarificationFormReducer(state, action);
  if (clarificationForm !== state) {
    state = { ...state, ...clarificationForm };
  }

  switch (action.type) {
    case ClarificationFormActionTypes.DisableClarification:
      return updateGroup<ClarificationFormValue>({
        clarifications: clarifications => ({
          ...clarifications,
          controls: {
            ...clarifications.controls,
            [action.payload.entityId]: disable(clarifications.controls[action.payload.entityId]),
          },
        }),
      })(state);

    case ClarificationFormActionTypes.FillClarification:
      return updateGroup<ClarificationFormValue>({
        clarifications: clarifications =>
          setValue(clarifications, {
            ...clarifications.value,
            [action.payload.entityId]: action.payload.clarification,
          }),
      })(state);

    case ClarificationFormActionTypes.InitClarifications:
      return updateGroup<ClarificationFormValue>({
        clarifications: clarifications =>
          setValue(
            clarifications,
            action.payload.entityIds.reduce(
              (value, entityId) => ({ ...value, [entityId]: '' }),
              {},
            ),
          ),
      })(state);

    default:
      return state;
  }
}

export const selectClarification = (state: State, entityId: string): string =>
  state.value.clarifications[entityId];
