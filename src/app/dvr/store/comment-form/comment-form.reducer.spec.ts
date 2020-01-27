import * as fromActions from './comment-form.actions';
import { FillComment } from './comment-form.actions';
import { DvrComments, DvrRefundComments } from './comment-form.model';
import {
  commentFormReducer,
  initialFormState,
  reducer,
  selectCombinedRefundComments,
  State,
} from './comment-form.reducer';
import { accountId, entityId } from '../dvr/dvr.reducer.spec';

const refundIds = ['42', '8888'];
const comments = ['Some comment #1', 'Some comment #2'];
export const refundComments: DvrRefundComments = {
  [refundIds[0]]: comments[0],
  [refundIds[1]]: comments[1],
};

const comment = comments[0];
const refundId = refundIds[0];

function getInitCommentState(state = initialFormState): State {
  return reducer(state, new fromActions.InitComments({ accountId, entityId, refundComments }));
}

describe('CommentForm Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialFormState, action);

      expect(result).toEqual({
        ...initialFormState,
        ...commentFormReducer(initialFormState, action),
      });
    });
  });

  describe('FillComment', () => {
    it('should fill a comment field', () => {
      const action = new fromActions.FillComment({ accountId, entityId, refundId, comment });

      const result = reducer(getInitCommentState(), action);
      const expected: DvrComments = {
        accounts: {
          [accountId]: {
            entities: {
              [entityId]: {
                refunds: {
                  ...refundComments,
                  [refundId]: comment,
                },
              },
            },
          },
        },
      };

      expect(result.value.comments).toEqual(expected);
    });
  });

  describe('InitComments', () => {
    it('should init comment fields with init value', () => {
      const action = new fromActions.InitComments({ accountId, entityId, refundComments });

      const result = reducer(initialFormState, action);
      const expected: DvrComments = {
        accounts: {
          [accountId]: {
            entities: {
              [entityId]: {
                refunds: refundComments,
              },
            },
          },
        },
      };

      expect(result.value.comments).toEqual(expected);
    });
  });

  describe('selectCombinedRefundComments', () => {
    it('should return RefundComments with all comments', () => {
      expect(selectCombinedRefundComments(getInitCommentState())).toEqual(refundComments);
    });
  });
});
