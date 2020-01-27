import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { SupportUserData } from '../../error-handler.model';

@Component({
  selector: 'dialog-user-comment',
  templateUrl: 'support-dialog.component.html',
  styleUrls: ['support-dialog.component.scss'],
})
export class SupportDialogComponent {
  @Output()
  public userData: EventEmitter<SupportUserData> = new EventEmitter<SupportUserData>();
  @Input()
  public isLoading = false;
  @Input()
  public ticketId = null;
  public isAfterSend = false;
  public supportUserData: SupportUserData = {
    frequency: '',
    severity: '',
    affectOn: '',
    userComment: '',
  };

  constructor(
    private dialogRef: MatDialogRef<SupportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public errorMessage: string,
  ) {}

  /**
   * operation
   * @return {string}
   */
  public operation(): void {
    if (this.isAfterSend) {
      this.dialogRef.close();
    } else {
      this.userData.emit(this.supportUserData);
      this.isAfterSend = true;
    }
  }

  /**
   * getButtonName
   * @return {string}
   */
  public getButtonName(): string {
    return this.isAfterSend ? 'close' : 'send';
  }

  /**
   * isDisableActionButton
   * Disable if loading or in sending mode and the form is valid
   * @param {NgForm} supportForm
   * @return {boolean}
   */
  public isDisableActionButton(supportForm: NgForm): boolean {
    return this.isLoading || (!this.isAfterSend && (!!supportForm.form && !supportForm.form.valid));
  }
}
