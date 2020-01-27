import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogContainerComponent } from '../container/dialog-container.component';
import { DialogStyleClass } from '../common.dialog-model';

@Component({
  selector: 'common-confirm-dialog',
  template: `
    <common-dialog-container [title]="title" [message]="message" [typeClass]="dialogStyleClass">
      <button mat-button [mat-dialog-close]="false" tabindex="-1">{{ denyButtonName }}</button>
      <button mat-button color="primary" [mat-dialog-close]="true" tabindex="1">
        {{ approveButtonName }}
      </button>
    </common-dialog-container>
  `,
})
export class ConfirmDialogComponent extends DialogContainerComponent {
  public approveButtonName = 'OK';
  public denyButtonName = 'NO';
  public dialogStyleClass: DialogStyleClass = DialogStyleClass.warning;

  constructor(public dialog: MatDialogRef<DialogContainerComponent>) {
    super();
  }
}
