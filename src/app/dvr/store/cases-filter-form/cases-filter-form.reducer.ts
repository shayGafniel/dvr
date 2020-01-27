import {
  box,
  createFormGroupState,
  createFormStateReducerWithUpdate,
  FormControlState,
  setValue,
  SetValueAction,
  unbox,
  updateGroup,
} from 'ngrx-forms';

import { CasesFilterFormActions, CasesFilterFormActionTypes } from './cases-filter-form.actions';
import { CasesFilterFormValue, State } from './cases-filter-form.state';
import { TimeFrame } from '../../../common/models/time-frame.model';
import { entityAllValueId } from '../../models/case.model';

export const FORM_ID = 'casesFilterForm';

export const initialFormState = createFormGroupState<CasesFilterFormValue>(FORM_ID, {
  entities: box([entityAllValueId]),
  id: '',
  status: null,
  timeFrame: TimeFrame.CurrentYear,
});

export const casesFilterFormReducer = createFormStateReducerWithUpdate<CasesFilterFormValue>(
  updateGroup<CasesFilterFormValue>({}),
);

export function reducer(state = initialFormState, action: CasesFilterFormActions): State {
  const casesFilterForm = casesFilterFormReducer(state, action);
  if (casesFilterForm !== state) {
    state = { ...state, ...casesFilterForm };
  }

  function isThatFormAction(): boolean {
    return Boolean(
      (action as SetValueAction<any>).controlId &&
        (action as SetValueAction<any>).controlId.includes(state.id),
    );
  }

  function resetStatus(status: FormControlState<string>): FormControlState<string> {
    return setValue(initialFormState.value.status as string)(status);
  }

  switch (action.type) {
    case CasesFilterFormActionTypes.FillCasesFilterForm:
      return updateGroup<CasesFilterFormValue>(
        Object.entries(action.payload).reduce(
          (updateFn, [key, value]) => ({
            ...updateFn,
            [key]: control => setValue(control, value),
          }),
          {},
        ),
      )(state);

    case CasesFilterFormActionTypes.FillEntities:
      return updateGroup<CasesFilterFormValue>({
        entities: setValue(box(action.payload.entities)),
        status: resetStatus,
      })(state);

    case CasesFilterFormActionTypes.FillStatus:
      return updateGroup<CasesFilterFormValue>({
        status: status => setValue(action.payload.status as string)(status),
      })(state);

    case CasesFilterFormActionTypes.FillTimeSelect:
      return updateGroup<CasesFilterFormValue>({
        timeFrame: timeFrame => setValue(action.payload.timeFrame as string)(timeFrame),
        status: resetStatus,
      })(state);

    case CasesFilterFormActionTypes.ResetCasesFilterForm:
      return initialFormState;

    case isThatFormAction() && SetValueAction.TYPE:
      return updateGroup<CasesFilterFormValue>({
        status: resetStatus,
      })(state);

    default:
      return state;
  }
}

export const selectCasesFilter = (state: State): CasesFilterFormValue => state.value;

export const selectSelectedEntitiesIds = (state: State): string[] => unbox(state.value.entities);

export const selectSelectedTimeFrame = (state: State): TimeFrame => state.value.timeFrame;
