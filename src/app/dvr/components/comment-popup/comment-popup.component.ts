import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { get } from 'lodash-es';
import { AbstractControlState } from 'ngrx-forms';

import * as fromCommentForm from '../../store/comment-form/comment-form.reducer';

@Component({
  selector: 'app-comment-popup',
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentPopupComponent implements OnInit {
  @Input()
  public accountId: number;
  @Input()
  public badge: number;
  @Input()
  public entityId: string;
  @Input()
  public formState: fromCommentForm.State;
  @Input()
  public maxlength: number;
  @Input()
  public refundId: string;

  constructor() {}

  public ngOnInit() {}

  public onControlClick(event: Event): void {
    event.stopPropagation();
  }

  public get refundComment(): AbstractControlState<any> {
    return get(
      this.formState.controls.comments.controls.accounts.controls,
      `[${this.accountId}].controls.entities.controls[${this.entityId}].controls.refunds.controls[${
        this.refundId
      }]`,
    );
  }
}
