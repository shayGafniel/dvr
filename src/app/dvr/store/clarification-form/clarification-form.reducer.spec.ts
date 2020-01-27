import * as fromActions from './clarification-form.actions';
import {
  clarificationFormReducer,
  initialFormState,
  reducer,
  selectClarification,
  State,
} from './clarification-form.reducer';
import { entityId, entityIds } from '../dvr/dvr.reducer.spec';

export const clarification = 'some clarification';

function getFilledClarificationState(state = initialFormState): State {
  return reducer(state, new fromActions.FillClarification({ clarification, entityId }));
}

describe('ClarificationForm Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialFormState, action);

      expect(result).toEqual({
        ...initialFormState,
        ...clarificationFormReducer(initialFormState, action),
      });
    });
  });

  describe('DisableClarification', () => {
    it('should disable a clarification field by entityId', () => {
      const action = new fromActions.DisableClarification({ entityId });

      const result = reducer(getFilledClarificationState(), action);

      expect(result.controls.clarifications.controls[entityId].isDisabled).toBe(true);
    });
  });

  describe('FillClarification', () => {
    it('should fill a clarification field by entityId', () => {
      const action = new fromActions.FillClarification({ clarification, entityId });

      const result = reducer(initialFormState, action);
      const expected = { [entityId]: clarification };

      expect(result.value.clarifications).toEqual(expected);
    });
  });

  describe('InitClarifications', () => {
    it('should init clarification fields with init value', () => {
      const action = new fromActions.InitClarifications({ entityIds });

      const result = reducer(initialFormState, action);
      const expected = entityIds.reduce((value, id) => ({ ...value, [id]: '' }), {});

      expect(result.value.clarifications).toEqual(expected);
    });
  });

  describe('selectClarification', () => {
    it('should return clarification value', () => {
      const state = getFilledClarificationState();

      expect(selectClarification(state, entityId)).toEqual(clarification);
    });
  });
});
