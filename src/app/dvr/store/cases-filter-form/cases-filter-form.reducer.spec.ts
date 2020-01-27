import { box, SetValueAction } from 'ngrx-forms';

import * as fromActions from './cases-filter-form.actions';
import {
  casesFilterFormReducer,
  FORM_ID,
  initialFormState,
  reducer,
  selectCasesFilter,
  selectSelectedEntitiesIds,
  selectSelectedTimeFrame,
} from './cases-filter-form.reducer';
import { CasesFilterFormValue, State } from './cases-filter-form.state';
import { TimeFrame } from '../../../common/models/time-frame.model';
import { ApproveStatus } from '../../models/dvr.model';

const entities: string[] = ['42', '2'];
const status = ApproveStatus.Draft;
const timeFrame = TimeFrame.LastYear;
export const casesFilterFormValue: CasesFilterFormValue = {
  entities: box(entities),
  id: '1',
  status,
  timeFrame,
};

function getFilledCasesFilterState(state = initialFormState): State {
  return reducer(state, new fromActions.FillCasesFilterForm(casesFilterFormValue));
}

describe('CasesFilterForm Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialFormState, action);

      expect(result).toEqual({
        ...initialFormState,
        ...casesFilterFormReducer(initialFormState, action),
      });
    });
  });

  describe('FillCasesFilterForm', () => {
    it('should fill all passed fields', () => {
      const action = new fromActions.FillCasesFilterForm(casesFilterFormValue);

      const result = reducer(initialFormState, action);

      expect(result.value).toEqual(casesFilterFormValue);
    });
  });

  describe('FillEntities', () => {
    const action = new fromActions.FillEntities({ entities });
    const result = reducer(initialFormState, action);

    it('should fill entities field', () => {
      expect(result.value.entities).toEqual(box(entities));
    });

    it('should reset status field', () => {
      expect(result.value.status).toEqual(initialFormState.value.status);
    });
  });

  describe('FillStatus', () => {
    it('should fill status field', () => {
      const action = new fromActions.FillStatus({ status });

      const result = reducer(initialFormState, action);

      expect(result.value.status).toEqual(status);
    });
  });

  describe('FillTimeSelect', () => {
    const action = new fromActions.FillTimeSelect({ timeFrame });
    const result = reducer(initialFormState, action);

    it('should fill timeFrame field', () => {
      expect(result.value.timeFrame).toEqual(timeFrame);
    });

    it('should reset status field', () => {
      expect(result.value.status).toEqual(initialFormState.value.status);
    });
  });

  describe('ResetCasesFilterForm', () => {
    it('should reset the form to initial value', () => {
      const action = new fromActions.ResetCasesFilterForm();

      const result = reducer(getFilledCasesFilterState(), action);

      expect(result).toEqual(initialFormState);
    });
  });

  describe('SetValueAction', () => {
    it('should reset status field', () => {
      const action = new SetValueAction(`${FORM_ID}.id`, '');

      const result = reducer(initialFormState, action);

      expect(result.value.status).toEqual(initialFormState.value.status);
    });
  });

  describe('selectCasesFilter', () => {
    it('should return casesFilter value', () => {
      const state = getFilledCasesFilterState();

      expect(selectCasesFilter(state)).toEqual(casesFilterFormValue);
    });
  });

  describe('selectSelectedEntitiesIds', () => {
    it('should return entities value', () => {
      const state = getFilledCasesFilterState();

      expect(selectSelectedEntitiesIds(state)).toEqual(entities);
    });
  });

  describe('selectSelectedTimeFrame', () => {
    it('should return timeFrame value', () => {
      const state = getFilledCasesFilterState();

      expect(selectSelectedTimeFrame(state)).toBe(timeFrame);
    });
  });
});
