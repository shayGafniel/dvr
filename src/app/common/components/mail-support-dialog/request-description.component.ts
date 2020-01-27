// second dialog - asks user to describe the problem

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'common-bo-support',
  templateUrl: './request-description.component.html',
})
export class RequestDescriptionComponent {
  public description: string;

  constructor(public dialog: MatDialogRef<RequestDescriptionComponent>) {}
}
