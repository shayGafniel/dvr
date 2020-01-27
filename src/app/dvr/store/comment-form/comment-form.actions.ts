import { Action } from '@ngrx/store';

import { DvrRefundComments } from './comment-form.model';

export enum CommentFormActionTypes {
  FillComment = '[CommentForm] Fill Comment',
  InitComments = '[CommentForm] Init Comments',
}

export class FillComment implements Action {
  public readonly type = CommentFormActionTypes.FillComment;

  constructor(
    public payload: { accountId: number; entityId: string; refundId: string; comment: string },
  ) {}
}

export class InitComments implements Action {
  public readonly type = CommentFormActionTypes.InitComments;

  constructor(
    public payload: { accountId: number; entityId: string; refundComments: DvrRefundComments },
  ) {}
}

export type CommentFormActions = FillComment | InitComments;
