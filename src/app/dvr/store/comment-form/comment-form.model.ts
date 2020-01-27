export interface DvrRefundComments {
  [refundId: string]: string;
}

export interface DvrComments {
  accounts: {
    [accountId: number]: {
      entities: {
        [entityId: string]: {
          refunds: DvrRefundComments;
        };
      };
    };
  };
}

export type DvrAccountComments = DvrComments['accounts'][number];

export type DvrEntityComments = DvrComments['accounts'][number]['entities'][string];

export interface CommentFormValue {
  comments: DvrComments;
}
