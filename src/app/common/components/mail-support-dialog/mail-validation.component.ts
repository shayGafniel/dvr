// first dialog - validates user email before it asks for support

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './mail-validation.component.html',
})
export class MailValidationComponent {
  public email: string;

  constructor(public dialog: MatDialogRef<MailValidationComponent>) {}
}
