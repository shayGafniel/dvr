import { ScapeLambHelper } from './scape-lamb.helper';

const ids = ['1'];
const names = ['name 1'];

describe('ScapeLambHelper', () => {
  describe('generateWorkloadsNames', () => {
    it('should return an WorkloadsNames object', () => {
      expect(ScapeLambHelper.generateWorkloadsNames(ids, names)).toEqual({ [ids[0]]: names[0] });
    });
  });
});
