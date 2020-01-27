import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-shared-dialog',
  templateUrl: './shared-dialog.component.html',
  styleUrls: ['./shared-dialog.component.scss'],
})
export class SharedDialogComponent {
  @Input()
  public title: string;
  @Input()
  public message: string;

  constructor(private dialogRef: MatDialogRef<SharedDialogComponent>) {}

  public closeDialog() {
    this.dialogRef.close();
  }
}
