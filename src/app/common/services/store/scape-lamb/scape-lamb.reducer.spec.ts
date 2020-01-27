import { WorkloadsNames } from '../../../models/scape-lamb.model';
import { LoadWorkloadsNames } from './scape-lamb.actions';
import { initialState, reducer, selectWorkloadsNames } from './scape-lamb.reducer';

export const ids: string[] = ['42', '2', '3'];
export const names: string[] = ['name 42', 'name 2', 'name 3'];
const workloadsNames: WorkloadsNames = {
  [ids[0]]: names[0],
  [ids[1]]: names[1],
  [ids[2]]: names[2],
};

const certainIds: string[] = [ids[0], ids[2]];
const certainNames: string[] = [names[0], names[2]];
const certainWorkloadsNames: WorkloadsNames = {
  [certainIds[0]]: certainNames[0],
  [certainIds[1]]: certainNames[1],
};

describe('ScapeLamb Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('LoadWorkloadsNames', () => {
    it('should fill companiesInfo field', () => {
      const action = new LoadWorkloadsNames({ ids, names });
      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, workloadsNames });
    });
  });

  describe('selectWorkloadsNames', () => {
    it('should return all values in field workloadsNames by all ids', () => {
      expect(selectWorkloadsNames({ ...initialState, workloadsNames }, ids)).toEqual(
        workloadsNames,
      );
    });

    it('should return certain values in field companiesInfo by certain ids', () => {
      expect(selectWorkloadsNames({ ...initialState, workloadsNames }, certainIds)).toEqual(
        certainWorkloadsNames,
      );
    });
  });
});
