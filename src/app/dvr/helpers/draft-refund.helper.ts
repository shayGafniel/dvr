import { DvrRefundComments } from '../../dvr/store/comment-form/comment-form.model';
import { DvrHelper } from './dvr.helper';
import { DraftRefund, Refund } from '../models/dvr.model';
import { RefundFlatNode } from '../models/refund.model';

export class DraftRefundHelper {
  public static generateDraftRefunds({
    comments,
    nodes,
    refunds,
  }: {
    comments: DvrRefundComments;
    nodes: RefundFlatNode[];
    refunds: Refund[];
  }): DraftRefund[] {
    const topLevelDraftRefunds: DraftRefund[] = DraftRefundHelper.getTopLevelDraftRefunds(
      nodes,
      comments,
    );

    return DraftRefundHelper.getFilledDraftRefunds({
      comments,
      nodes,
      refunds,
      topLevelDraftRefunds,
    });
  }

  private static getTopLevelDraftRefunds(
    nodes: RefundFlatNode[],
    comments: DvrRefundComments,
  ): DraftRefund[] {
    return nodes
      .filter(node => node.level === 0)
      .map(node => DraftRefundHelper.draftRefundToFlatNode(node.refund, comments));
  }

  private static draftRefundToFlatNode(refund: Refund, comments: DvrRefundComments): DraftRefund {
    return {
      name: refund.name,
      comment: comments[refund.id],
      country: refund.country,
      children: [],
    };
  }

  private static getFilledDraftRefunds({
    comments,
    nodes,
    refunds,
    topLevelDraftRefunds,
  }: {
    comments: DvrRefundComments;
    nodes: RefundFlatNode[];
    refunds: Refund[];
    topLevelDraftRefunds: DraftRefund[];
  }): DraftRefund[] {
    return nodes
      .filter(node => node.level === 1)
      .reduce((modifiedTopLevelDraftRefunds: DraftRefund[], node) => {
        const refundParent: Refund = DvrHelper.findRefundParent(refunds, node.refund);
        const draftRefundParentIndex: number = DraftRefundHelper.findIndexDraftRefund(
          modifiedTopLevelDraftRefunds,
          refundParent,
        );
        const draftRefundParent: DraftRefund =
          modifiedTopLevelDraftRefunds[draftRefundParentIndex] ||
          DraftRefundHelper.draftRefundToFlatNode(refundParent, comments);

        draftRefundParent.children.push({
          comment: comments[node.refund.id],
          name: node.refund.name,
        });

        return draftRefundParentIndex >= 0
          ? modifiedTopLevelDraftRefunds
          : [...modifiedTopLevelDraftRefunds, draftRefundParent];
      }, topLevelDraftRefunds);
  }

  private static findIndexDraftRefund(draftRefunds: DraftRefund[], target: Refund): number {
    return draftRefunds.findIndex(
      draftRefund => draftRefund.name === target.name && draftRefund.country === target.country,
    );
  }
}
