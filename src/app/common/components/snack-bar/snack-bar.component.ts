import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material';

@Component({
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px">
      <div [innerHTML]="data.html"></div>
      <button mat-button (click)="snackBar.dismiss()" color="warn">OK</button>
    </div>
  `,
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBar: MatSnackBar) {}
}
