import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogContainerComponent } from '../container/dialog-container.component';
import { DialogStyleClass } from '../common.dialog-model';

@Component({
  selector: 'common-error-dialog',
  template: `<common-dialog-container [title]="title" [message]="message" [typeClass]="dialogStyleClass">
                 <button mat-button [mat-dialog-close] tabindex="1">{{ buttonName }}</button>
               </common-dialog-container>`,
})
export class ErrorDialogComponent extends DialogContainerComponent {
  public buttonName = 'Close';
  public dialogStyleClass: DialogStyleClass = DialogStyleClass.error;

  constructor(public dialog: MatDialogRef<DialogContainerComponent>) {
    super();
  }
}
