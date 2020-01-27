import * as fromActions from './date-range-form.actions';
import {
  dateRangeFormReducer,
  initialFormState,
  reducer,
  selectEnd,
  selectIsDisabledEntities,
  selectStart,
  State,
} from './date-range-form.reducer';
import { accountId, entityId, entityIds } from '../dvr/dvr.reducer.spec';
import { DvrHelper } from '../../helpers/dvr.helper';
import { IsDisabledEntities, RangeValue } from '../../models/dvr.model';

export const end = '2018-10';
export const start = '2018-02';

export const range: RangeValue = { end, start };

function getInitializedState(state = initialFormState): State {
  return reducer(state, new fromActions.InitDateRanges({ accountId, entityIds }));
}

function getFilledState(): State {
  const initializedState = getInitializedState();

  return reducer(initializedState, new fromActions.FillDateRange({ accountId, entityId, range }));
}

function getDisabledState(): State {
  const initializedState = getFilledState();

  return reducer(initializedState, new fromActions.DisableDateRange({ accountId, entityId }));
}

describe('DateRangeForm Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialFormState, action);

      expect(result).toEqual({
        ...initialFormState,
        ...dateRangeFormReducer(initialFormState, action),
      });
    });
  });

  describe('DisableDateRange', () => {
    it('should disable a dateRange field by entityId', () => {
      const action = new fromActions.DisableDateRange({ accountId, entityId });

      const result = reducer(getInitializedState(), action);

      expect(result.controls.dateRanges.controls[accountId].controls[entityId].isDisabled).toBe(
        true,
      );
    });
  });

  describe('EnableDateRange', () => {
    it('should enable a dateRange field by entityId', () => {
      const disabledState = reducer(
        getInitializedState(),
        new fromActions.DisableDateRange({ accountId, entityId }),
      );
      expect(
        disabledState.controls.dateRanges.controls[accountId].controls[entityId].isDisabled,
      ).toBe(true);

      const action = new fromActions.EnableDateRange({ accountId, entityId });
      const result = reducer(disabledState, action);
      expect(result.controls.dateRanges.controls[accountId].controls[entityId].isDisabled).toBe(
        false,
      );
    });
  });

  describe('FillDateRange', () => {
    it('should fill a dateRange field by entityId', () => {
      const action = new fromActions.FillDateRange({ accountId, entityId, range });

      const result = reducer(getInitializedState(), action);
      const expected = { [accountId]: { [entityId]: range } };

      expect(result.value.dateRanges).toEqual(expected);
    });
  });

  describe('InitDateRanges', () => {
    it('should init dateRange fields with init value', () => {
      const action = new fromActions.InitDateRanges({ accountId, entityIds });

      const result = reducer(initialFormState, action);
      const entities = entityIds.reduce(
        (value, id) => ({ ...value, [id]: DvrHelper.getEmptyDateRange() }),
        {},
      );
      const expected = { [accountId]: entities };

      expect(result.value.dateRanges).toEqual(expected);
    });
  });

  describe('ResetDateRange', () => {
    it('should reset value from a dateRange field by entityId', () => {
      const action = new fromActions.ResetDateRange({ accountId, entityId });

      const result = reducer(getFilledState(), action);
      const expected = DvrHelper.getEmptyDateRange();

      expect(result.controls.dateRanges.controls[accountId].controls[entityId].value).toEqual(
        expected,
      );
    });
  });

  describe('selectEnd', () => {
    it('should return formatted date', () => {
      const state = getFilledState();

      expect(selectEnd(state, accountId, entityId)).toEqual(end);
    });

    it('should return empty string if no entity', () => {
      expect(selectEnd(getInitializedState(), accountId, null)).toBe('');
    });
  });

  describe('selectIsDisabledEntities', () => {
    it('should return IsDisabledEntities structure', () => {
      const state = getFilledState();
      const expected: IsDisabledEntities = { [entityId]: false };

      expect(selectIsDisabledEntities(state, accountId)).toEqual(expected);
    });

    it('should return true if it is disabled', () => {
      const state = getDisabledState();
      const expected: IsDisabledEntities = { [entityId]: true };

      expect(selectIsDisabledEntities(state, accountId)).toEqual(expected);
    });
  });

  describe('selectStart', () => {
    it('should return formatted date', () => {
      const state = getFilledState();

      expect(selectStart(state, accountId, entityId)).toEqual(start);
    });

    it('should return empty string if no entity', () => {
      expect(selectStart(getInitializedState(), accountId, null)).toBe('');
    });
  });
});
