import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Action } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { SnackbarComponent } from '../../components/snack-bar/snack-bar.component';

@Injectable()
export class LoadIndicatorService {
  public readonly isLoadingChanges = new BehaviorSubject<boolean>(false);

  private readonly requestActions: Set<string> = new Set();

  constructor(private snackBar: MatSnackBar) {}

  private static payloadHasStringError(payload: any): boolean {
    return (
      payload instanceof HttpErrorResponse &&
      typeof payload.error === 'string' &&
      !payload.error.startsWith('<http')
    );
  }

  public addRequest(requestActionType: string): void {
    if (requestActionType.endsWith(' Fail') || requestActionType.endsWith(' Success')) {
      this.removeRequest(requestActionType);
    } else {
      this.requestActions.add(requestActionType);
    }
    this.checkLoading();
  }

  private removeRequest(requestActionType: string): void {
    const requestAction = requestActionType.replace(/( Fail)|( Success)/, '');

    if (!this.requestActions.has(requestAction)) {
      throw new Error(`Appropriate action was not found for '${requestActionType}'`);
    }

    this.requestActions.delete(requestAction);
  }

  private checkLoading(): void {
    this.isLoadingChanges.next(this.requestActions.size !== 0);
  }

  public failedRequest(action: Action & { payload: any }): void {
    let message = '';
    if (LoadIndicatorService.payloadHasStringError(action.payload)) {
      message = action.payload.error;
    } else {
      message = action.type.replace(/\[.+\]\s/, '');
    }

    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        html: message,
      },
    });
  }
}
