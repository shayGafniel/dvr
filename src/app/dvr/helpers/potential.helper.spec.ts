import { Slice } from '../models/pie-chart.model';
import { potentialColors, PotentialDisplay, PotentialType } from '../models/potential.model';
import { RefundFlatNode, RefundNode } from '../models/refund.model';
import { PotentialHelper } from './potential.helper';
import {
  potentialForEntity as potential,
  refunds,
  zeroPotentialForEntity,
} from '../store/dvr/dvr.reducer.spec';

describe('PotentialHelper', () => {
  it('should have the same count of fields in orders as in values', () => {
    const orderKeysCount = potential.order.length;
    const valuesKeysCount = Object.keys(potential.values).length;

    expect(orderKeysCount).toBe(
      valuesKeysCount,
      'fields counts of order and values are not the same',
    );
  });

  describe('getTotalValue', () => {
    it('should return total value', () => {
      const totalValue = PotentialHelper.getTotalValue(potential);
      const expected = Object.values(potential.values).reduce((total, value) => total + value, 0);

      expect(totalValue).toBe(expected);
    });

    it('should throw an error if potential order has an excess key', () => {
      const wrongKey = 'wrongKey';
      const brokenPotential = { ...potential, order: [...potential.order, wrongKey as any] };

      expect(() => PotentialHelper.getTotalValue(brokenPotential)).toThrowError(
        `Potential type '${wrongKey}' not found`,
      );
    });

    it('should throw an error if potential values does not have a required kye', () => {
      const brokenPotential = {
        ...potential,
        values: { ...potential.values, [PotentialType.Qualified]: undefined },
      };

      expect(() => PotentialHelper.getTotalValue(brokenPotential)).toThrowError(
        `Potential type '${PotentialType.Qualified}' not found`,
      );
    });
  });

  describe('getPotentialDisplay', () => {
    const type = PotentialType.Disqualified;

    it('should return Potential Display model', () => {
      const value = potential.values[type];
      const totalValue = PotentialHelper.getTotalValue(potential);

      const potentialDisplay = PotentialHelper.getPotentialDisplay(potential, type);

      const expected: PotentialDisplay = {
        color: potentialColors[type],
        percent: value / totalValue,
        type,
        value,
      };

      expect(potentialDisplay).toEqual(expected);
    });

    it('should return 0 percent if value is 0', () => {
      const potentialDisplay = PotentialHelper.getPotentialDisplay(zeroPotentialForEntity, type);

      const expected: PotentialDisplay = {
        color: potentialColors[type],
        percent: 0,
        type,
        value: 0,
      };

      expect(potentialDisplay).toEqual(expected);
    });
  });

  describe('getSortedPotentialDisplays', () => {
    it('should return Potential Displays in correct order', () => {
      const potentialDisplays: PotentialDisplay[] = PotentialHelper.getSortedPotentialDisplays(
        potential,
      );
      const expectedLength = Object.keys(potential.values).length;

      expect(potentialDisplays.length).toBe(
        expectedLength,
        'number of potential displays are not correct',
      );

      potentialDisplays.forEach((potentialDisplay, i) => {
        expect(potentialDisplay.type).toBe(potential.order[i]);
      });
    });
  });

  describe('potentialToSlices', () => {
    it('should return Slices in correct order', () => {
      const slices: Slice[] = PotentialHelper.potentialToSlices(potential);
      const expectedLength = Object.keys(potential.values).length;
      const potentialDisplays: PotentialDisplay[] = PotentialHelper.getSortedPotentialDisplays(
        potential,
      );

      expect(slices.length).toBe(expectedLength, 'number of slices are not correct');

      slices.forEach((slice, i) => {
        expect(slice.color).toBe(potentialDisplays[i].color);
        expect(slice.percent).toBe(potentialDisplays[i].percent);
      });
    });
  });

  describe('potentialToSlicesWholeNumber', () => {
    it('should return Slices with field percent as a whole number', () => {
      const slices: Slice[] = PotentialHelper.potentialToSlicesWholeNumber(potential);
      const expectedLength = Object.keys(potential.values).length;
      const potentialDisplays: PotentialDisplay[] = PotentialHelper.getSortedPotentialDisplays(
        potential,
      );

      expect(slices.length).toBe(expectedLength, 'number of slices are not correct');

      slices.forEach((slice, i) => {
        expect(slice.color).toBe(potentialDisplays[i].color);
        expect(slice.percent).toBe(potentialDisplays[i].percent * 100);
      });
    });
  });

  describe('refundNodeToFlatNode', () => {
    it('should return flat node from node', () => {
      const level = 1;
      const items = ['1', '2'];

      const nodes: RefundNode[] = [
        { children: [], item: items[0], refund: refunds[0], parent: null },
        { children: null, item: items[1], refund: refunds[1], parent: null },
      ];
      const flatNodes: RefundFlatNode[] = [
        Object.assign(new RefundFlatNode(), {
          expandable: true,
          item: items[0],
          level,
          refund: refunds[0],
          parent: null,
        }),
        Object.assign(new RefundFlatNode(), {
          expandable: false,
          item: items[1],
          level,
          refund: refunds[1],
          parent: null,
        }),
      ];

      nodes.forEach((node, i) => {
        expect(PotentialHelper.refundNodeToFlatNode(node, level, null)).toEqual(flatNodes[i]);
      });
    });
  });
});
