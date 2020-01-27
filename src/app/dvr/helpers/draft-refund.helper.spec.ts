import { DraftRefundHelper } from './draft-refund.helper';
import { customDraftRefunds, customFlatNodes, customRefunds } from './dvr.helper.spec';
import { refundComments } from '../store/comment-form/comment-form.reducer.spec';

describe('DraftRefundHelper', () => {
  describe('generateDraftRefunds', () => {
    it('should return draft refunds from flat nodes', () => {
      expect(
        DraftRefundHelper.generateDraftRefunds({
          comments: refundComments,
          nodes: customFlatNodes,
          refunds: customRefunds,
        }),
      ).toEqual(customDraftRefunds);
    });
  });
});
