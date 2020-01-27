import { Slice } from '../models/pie-chart.model';
import {
  Potential,
  potentialColors,
  PotentialDisplay,
  PotentialType,
} from '../models/potential.model';
import { RefundFlatNode, RefundNode } from '../models/refund.model';

export class PotentialHelper {
  public static getPotentialDisplay(potential: Potential, type: PotentialType): PotentialDisplay {
    const totalValue = PotentialHelper.getTotalValue(potential);
    const value = potential.values[type];

    return {
      color: potentialColors[type],
      percent: totalValue > 0 ? value / totalValue : 0,
      type,
      value,
    };
  }

  public static getSortedPotentialDisplays(potential: Potential): PotentialDisplay[] {
    return potential.order.map(potentialType =>
      PotentialHelper.getPotentialDisplay(potential, potentialType),
    );
  }

  public static getTotalValue(potential: Potential): number {
    return potential.order.reduce((totalValue, potentialType) => {
      const value = potential.values[potentialType];

      if (typeof value === 'undefined') {
        throw new Error(`Potential type '${potentialType}' not found`);
      }

      return totalValue + value;
    }, 0);
  }

  public static potentialToSlices(potential: Potential): Slice[] {
    return PotentialHelper.getSortedPotentialDisplays(potential).map(potentialDisplay => ({
      color: potentialDisplay.color,
      percent: potentialDisplay.percent,
    }));
  }

  public static potentialToSlicesWholeNumber(potential: Potential): Slice[] {
    return PotentialHelper.potentialToSlices(potential).map(slice => ({
      ...slice,
      percent: slice.percent * 100,
    }));
  }

  public static refundNodeToFlatNode = (node: RefundNode, level: number, parent: string): RefundFlatNode => {
    const flatNode = new RefundFlatNode();

    flatNode.expandable = Boolean(node.children);
    flatNode.item = node.item;
    flatNode.parent = parent;
    flatNode.level = level;
    flatNode.refund = node.refund;
    if (!!flatNode.refund.details) flatNode.refund.details.images = null;

    return flatNode;
  };
}
