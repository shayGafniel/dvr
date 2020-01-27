import { LoadWorkloadPriorities } from '../../../contracts/workload-priorities/workload-priorities.actions';
import { expediteWorkloadResponseModel } from '../../expedite/expedite.mock';
import { group, initialState, reducer, selectWorkloadPriorities } from './expedite.reducer';
import { WorkloadPriority } from '../../../models/work-dispatcher.model';

export const workloadPriorities: WorkloadPriority[] = expediteWorkloadResponseModel().workloads;

describe('Expedite Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('LoadWorkloadPriorities', () => {
    it('should fill workloadPriorities field', () => {
      const action = new LoadWorkloadPriorities(group, { workloadPriorities });
      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, workloadPriorities });
    });
  });

  describe('selectWorkloadPriorities', () => {
    it('should return field workloadPriorities', () => {
      expect(selectWorkloadPriorities({ ...initialState, workloadPriorities })).toEqual(
        workloadPriorities,
      );
    });
  });
});
