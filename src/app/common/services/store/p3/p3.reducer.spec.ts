import { LoadWorkloadPriorities } from '../../../contracts/workload-priorities/workload-priorities.actions';
import { chaoticWorkloadPriorities } from '../../p1/p1.mock';
import { group, initialState, reducer, selectWorkloadPriorities } from './p3.reducer';
import { WorkloadPriority } from '../../../models/work-dispatcher.model';

const workloadPriorities: WorkloadPriority[] = chaoticWorkloadPriorities().workloads;

describe('P3 Reducer', () => {
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
