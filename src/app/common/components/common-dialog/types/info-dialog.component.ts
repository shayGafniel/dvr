import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogContainerComponent } from '../container/dialog-container.component';
import { DialogStyleClass } from '../common.dialog-model';

@Component({
  selector: 'common-info-dialog',
  template: `<common-dialog-container [title]="title" [message]="message" [typeClass]="dialogStyleClass">
                 <button mat-button color="primary" [mat-dialog-close]="true" tabindex="1">{{ buttonName }}</button>
               </common-dialog-container>`,
})
export class InfoDialogComponent extends DialogContainerComponent {
  public buttonName = 'Ok';
  public dialogStyleClass: DialogStyleClass = DialogStyleClass.success;

  constructor(public dialog: MatDialogRef<DialogContainerComponent>) {
    super();
  }
}
