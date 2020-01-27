import { LoadWorkEntities } from '../../../contracts/work-entities/work-entities.actions';
import { matcherWorkEntities } from '../../matcher/mock';
import { group, initialState, reducer, selectWorkEntities } from './matcher.reducer';
import { WorkEntity } from '../../../models/work-dispatcher.model';

export const workEntities: WorkEntity[] = matcherWorkEntities().companies.map(matcherEntity => ({
  companyId: matcherEntity.companyId,
  inProgress: matcherEntity.reportsLeft,
}));

describe('Matcher Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('LoadWorkEntities', () => {
    it('should fill workEntities field', () => {
      const action = new LoadWorkEntities(group, { workEntities });
      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, workEntities });
    });
  });

  describe('selectWorkEntities', () => {
    it('should return field workEntities', () => {
      expect(selectWorkEntities({ ...initialState, workEntities })).toEqual(workEntities);
    });
  });
});
