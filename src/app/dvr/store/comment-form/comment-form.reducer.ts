import { entries, isEmpty, isEqual, isObject } from 'lodash-es';
import {
  createFormGroupState,
  createFormStateReducerWithUpdate,
  FormGroupState,
  setValue,
  updateGroup,
} from 'ngrx-forms';

import { CommentFormActions, CommentFormActionTypes } from './comment-form.actions';
import {
  CommentFormValue,
  DvrAccountComments,
  DvrEntityComments,
  DvrRefundComments,
} from './comment-form.model';

const FORM_ID = 'commentForm';

export const initialFormState = createFormGroupState<CommentFormValue>(FORM_ID, {
  comments: {
    accounts: {},
  },
});

export interface State extends FormGroupState<CommentFormValue> {}

export const commentFormReducer = createFormStateReducerWithUpdate<CommentFormValue>(
  updateGroup<CommentFormValue>({}),
);

export const selectRefundComments = (
  state: State,
  accountId: number,
  entityId: string,
): DvrRefundComments => {
  const account = state.value.comments.accounts[accountId];

  if (isEmpty(account) || isEmpty(account.entities) || isEmpty(account.entities[entityId])) {
    return {};
  }

  return account.entities[entityId].refunds;
};

export function reducer(state = initialFormState, action: CommentFormActions): State {
  const commentForm = commentFormReducer(state, action);
  if (commentForm !== state) {
    state = { ...state, ...commentForm };
  }

  switch (action.type) {
    case CommentFormActionTypes.FillComment:
      return updateGroup<CommentFormValue>({
        comments: comments => {
          const value = comments.value;
          const { accountId, entityId, refundId, comment } = action.payload;

          return setValue(comments, {
            accounts: {
              ...value.accounts,
              [accountId]: {
                entities: {
                  ...value.accounts[accountId].entities,
                  [entityId]: {
                    refunds: {
                      ...value.accounts[accountId].entities[entityId].refunds,
                      [refundId]: comment,
                    },
                  },
                },
              },
            },
          });
        },
      })(state);

    case CommentFormActionTypes.InitComments:
      return updateGroup<CommentFormValue>({
        comments: comments => {
          const { accountId, entityId, refundComments } = action.payload;

          const accounts = comments.value.accounts;
          const entities = isObject(accounts[accountId]) ? accounts[accountId].entities : {};

          const storiedRefunds = selectRefundComments(state, accountId, entityId);
          const refunds = { ...refundComments, ...storiedRefunds };

          return isEqual(refunds, storiedRefunds)
            ? comments
            : setValue(comments, {
                accounts: {
                  ...accounts,
                  [accountId]: {
                    entities: {
                      ...entities,
                      [entityId]: { refunds },
                    },
                  },
                },
              });
        },
      })(state);

    default:
      return state;
  }
}

const selectCommentsFromEntity = (
  entityId: string,
  entityAggregator: DvrEntityComments,
): DvrRefundComments => {
  return entries(entityAggregator.refunds).reduce(
    (commentsAccumulator: DvrRefundComments, [refundId, comment]) => ({
      ...commentsAccumulator,
      [refundId]: comment,
    }),
    {},
  );
};

const selectCommentsFromAccount = (
  accountId: number,
  accountAggregator: DvrAccountComments,
): DvrRefundComments => {
  return entries(accountAggregator.entities).reduce(
    (commentsAccumulator: DvrRefundComments, [entityId, entityAggregator]) => {
      const commentsFromEntity = selectCommentsFromEntity(entityId, entityAggregator);

      return { ...commentsAccumulator, ...commentsFromEntity };
    },
    {},
  );
};

export const selectCombinedRefundComments = (state: State): DvrRefundComments => {
  return entries(state.value.comments.accounts).reduce(
    (commentsAccumulator: DvrRefundComments, [accountId, accountAggregator]) => {
      const commentsFromAccount = selectCommentsFromAccount(
        parseInt(accountId, 10),
        accountAggregator,
      );

      return { ...commentsAccumulator, ...commentsFromAccount };
    },
    {},
  );
};
