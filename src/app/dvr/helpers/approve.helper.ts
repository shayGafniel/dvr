import { Approve, ApproveStatus, GroupedRefunds, Refund } from '../models/dvr.model';

export class ApproveHelper {
  public static generateGroupedRefunds(refunds: Refund[]): GroupedRefunds {
    return refunds.reduce(
      (groupedRefunds: GroupedRefunds, refund: Refund) => ({
        ...groupedRefunds,
        [refund.country]: [...(groupedRefunds[refund.country] || []), refund],
      }),
      {},
    );
  }

  public static isAbleToApproveStatus(status: ApproveStatus): boolean {
    return status === ApproveStatus.Draft;
  }

  public static isFilledRefunds(approve: Approve): boolean {
    return Boolean(approve) && Array.isArray(approve.refunds) && Boolean(approve.refunds.length);
  }
}
