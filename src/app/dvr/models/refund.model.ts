import { Refund } from './dvr.model';

export interface RefundEntity {
  id: string;
  name: string;
  isUpdated: boolean;
}

/**
 * Transformed node without children's data and with flat structure for list's tree drawing
 */
export class RefundFlatNode {
  public expandable: boolean;
  public item: string;
  public parent: string;
  public level: number;
  public refund: Refund;
}

/**
 * Node with included children's data
 */
export class RefundNode {
  public children: RefundNode[];
  public item: string;
  public parent: string;
  public refund: Refund;
}

export interface GroupedRefundNodes {
  [country: string]: RefundNode[];
}
