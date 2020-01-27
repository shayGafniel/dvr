import { LoadWorkEntities } from '../../../contracts/work-entities/work-entities.actions';
import { entityLevelMock } from '../../cropping/cropping.mock';
import { group, initialState, reducer, selectWorkEntities } from './cropping.reducer';
import { WorkEntity } from '../../../models/work-dispatcher.model';

const workEntities: WorkEntity[] = entityLevelMock().map(entityLevel => ({
  companyId: entityLevel.entityId,
  inProgress: entityLevel.inProgress,
}));

describe('Cropping Reducer', () => {
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
