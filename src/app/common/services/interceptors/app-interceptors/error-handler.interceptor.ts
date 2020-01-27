import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { ApplicationHttpErrorCode } from '../../../utils/utils';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
  private lastErrorStack: string; // The last error stack in order to avoid infinite exception

  // Be aware this piece of code ("Angular error handler") is running out of the angular zone
  constructor(private injector: Injector) {}

  public handleError(error: Error | HttpErrorResponse) {
    const errorHandlerService = this.injector.get(ErrorHandlerService); // This interceptor is loaded before the service
    if (!!error && this.lastErrorStack !== (error as Error).stack) {
      this.lastErrorStack = (error as Error).stack;
      if (error instanceof HttpErrorResponse) {
        // Server or connection error happened
        if (!navigator.onLine) {
          // Handle offline error
          console.warn('Working offline!');
        } else {
          // Handle Http Error (error.status === 403, 404...)
          ApplicationHttpErrorCode.lastHttpError = error.status;
        }
      } else {
        ApplicationHttpErrorCode.lastHttpError = null;
        errorHandlerService.notifyError(error);
      }
    }
  }
}
