// third dialog - asks user to copy to logger's logs to the mail

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'common-bo-support',
  templateUrl: './build-mail-instructions.html',
})
export class BuildMailInstructionComponent {
  public logs: string;

  constructor(public dialog: MatDialogRef<BuildMailInstructionComponent>) {}
}
