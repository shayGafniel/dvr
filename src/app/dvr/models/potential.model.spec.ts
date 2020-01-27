import {
  potentialColors,
  PotentialType,
  sortedPotentialTypesForAccount,
  sortedPotentialTypesForEntity,
} from './potential.model';

describe('Potential models', () => {
  const expectedFieldsCount = Object.keys(PotentialType).length;

  describe('potentialColors', () => {
    it('should have the same fields as in PotentialType', () => {
      const countOfFields = Object.keys(potentialColors).length;

      expect(countOfFields).toBe(expectedFieldsCount);
    });
  });

  describe('sortedPotentialTypesForAccount', () => {
    it('should have the same fields as in PotentialType', () => {
      expect(sortedPotentialTypesForAccount.length).toBe(expectedFieldsCount);
    });
  });

  describe('sortedPotentialTypesForEntity', () => {
    it('should have the same fields as in PotentialType', () => {
      expect(sortedPotentialTypesForEntity.length).toBe(expectedFieldsCount);
    });
  });
});
