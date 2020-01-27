import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import * as StackTraceParser from 'error-stack-parser';
import { StackFrame } from 'error-stack-parser';
import * as moment from 'moment';

import { HTTP_FORBIDDEN } from '../../contracts/base-api';
import { SupportDialogComponent } from './dialog/support/support-dialog.component';
import {
  ErrorInfo,
  ServerEmailSupport,
  SnackBarError,
  SupportResponse,
} from './error-handler.model';
import { LoggerService } from '../logger/logger.service';
import { SecurityService } from '../security/security.service';
import { ApplicationHttpErrorCode } from '../../utils/utils';

const EVIDENCE_ALREADY_COMPLETED = 'EvidenceAlreadyCompleted';
const url = '/api/support/v1.0/ticket';

// NEVER use console.error here!! You will do a cycle call because we override console.error that make a call to this class
@Injectable()
export class ErrorHandlerService {
  private static isErrSnackBarOpen = false;
  private readonly defaultError =
    'Something went wrong. Please use the support button to send a report.';
  private dialog = this.injector.get(MatDialog);
  private snackBar = this.injector.get(MatSnackBar);
  private http = this.injector.get(HttpClient);
  private ngZone = this.injector.get(NgZone);
  private loggerService = this.injector.get(LoggerService);
  private errorInfo: ErrorInfo;

  constructor(private injector: Injector) {}

  public notifyError(err: any): void {
    try {
      const [errMessage, httpErrCode] = this.getUserErrMsgAndHttpErrCode(err);
      this.errorInfo = this.generateErrorInfoObject(err);
      this.showErrInSnackBar(errMessage, httpErrCode);
      this.printError(this.errorInfo);
      if (httpErrCode !== HTTP_FORBIDDEN) {
        this.sendErrorToLoggerService(this.errorInfo);
      }
    } catch (err) {
      console.log(`%cError Handler Exception: ${err}`, 'color: darkred');
    }
  }

  /**
   * sendMailWithLastErrorToSupport
   */
  public sendMailSupportWithLastError(): void {
    const dialogRef = this.showSupportDialog();
    dialogRef.componentInstance.userData.subscribe((userData: ServerEmailSupport) => {
      dialogRef.componentInstance.isLoading = true;
      if (this.errorInfo && this.errorInfo.message) {
        userData.applicationMessage = this.errorInfo.message;
      }
      userData.lastHttpCalls = this.loggerService.getLastCallArray();
      this.http.post(url, JSON.stringify(userData)).subscribe(
        (supportResponse: SupportResponse) => {
          dialogRef.componentInstance.isLoading = false;
          dialogRef.componentInstance.ticketId = supportResponse.ticketId;
          this.errorInfo = null;
        },
        () => {
          dialogRef.componentInstance.isLoading = false;
          dialogRef.componentInstance.ticketId = null;
        },
      );
    });
  }

  // *************************** Private Methods ***************************
  /**
   * addContextInfo
   * @param error
   */
  private generateErrorInfoObject(error: any): ErrorInfo {
    const securityService = this.injector.get(SecurityService);
    const errMessage =
      typeof error === 'string' ? error : error.message || JSON.stringify(error).toString();

    const errorInfo: ErrorInfo = {
      message: errMessage,
      errId: `Backoffice3.0-${new Date().getTime()}`,
      name: error.name || null,
      status: error.status || null,
      userEmail: securityService.userDetails().email,
      time: moment().format('l LTS'),
      stack: error instanceof HttpErrorResponse ? null : this.generateStackTrace(error),
    };
    return errorInfo;
  }

  /**
   * openSnackBar
   * @param {string} errMessage
   */
  private openSnackBar(errMessage = this.defaultError): void {
    ErrorHandlerService.isErrSnackBarOpen = true;
    const errSnackBar = this.snackBar.open(errMessage, 'X');
    errSnackBar.afterDismissed().subscribe(() => {
      ErrorHandlerService.isErrSnackBarOpen = false;
    });
  }

  /**
   * getSnackBarErrMessage
   * @return {SnackBarError} [userErrMessage, httpErrCode]
   */
  private getUserErrMsgAndHttpErrCode(err: any): SnackBarError {
    if (!!ApplicationHttpErrorCode) {
      const httpErrCode = ApplicationHttpErrorCode.lastHttpError;
      if (ApplicationHttpErrorCode.lastHttpError === HTTP_FORBIDDEN) {
        return [
          "You don't have permission to this operation. Please contact your administrator.",
          httpErrCode,
        ];
      } else {
        try {
          if (JSON.parse(err).reason === EVIDENCE_ALREADY_COMPLETED)
            return [
              'Invoice is not in correct state to be completed, please refresh your browser',
              400,
            ];
        } catch (err) {}
      }
      return [this.defaultError, null];
    }
  }

  /**
   * showErrorDialog
   */
  private showErrInSnackBar(errMessage = this.defaultError, httpErrCode = null): void {
    // Show an error dialog
    if (!ErrorHandlerService.isErrSnackBarOpen || httpErrCode === HTTP_FORBIDDEN) {
      if (NgZone.isInAngularZone()) {
        this.openSnackBar(errMessage);
      } else {
        this.ngZone.run(() => this.openSnackBar(errMessage)); // Angular Error handler run out of angular zone
      }
    }
  }

  /**
   * showSupportDialog
   * @return {SupportDialogComponent}
   */
  private showSupportDialog(): MatDialogRef<SupportDialogComponent> {
    try {
      this.snackBar.dismiss(); // Close an open snack bar if exists
    } catch (err) {}
    return this.dialog.open(SupportDialogComponent);
  }

  /**
   * sendErrorToLoggerService
   * @param {ErrorInfo} errorInfo
   */
  private sendErrorToLoggerService(errorInfo: ErrorInfo): void {
    // Send error to kubernetes logger
    this.http.post('/api/backoffice/v1.0/logs', errorInfo, { responseType: 'text' }).subscribe(
      () => {},
      (err: HttpErrorResponse) => {
        this.printError(this.generateErrorInfoObject(err));
      },
    );
  }

  /**
   * generateStackTrace
   */
  private generateStackTrace(error: any): string {
    const stackTrace = StackTraceParser.parse(new Error(error));
    const listOfStackFrameString = [];
    stackTrace.forEach((trace: StackFrame) => {
      try {
        listOfStackFrameString.push(`${(trace.source as string).trim()}`);
      } catch (e) {
        console.log(e);
        // Do nothing in a case of error
      }
    });
    return listOfStackFrameString.join('\n');
  }

  /**
   * generateLoggerPayload
   * @param error
   * @return {any}
   */
  /*  private generateLoggerPayload(errorInfo: any): any {
    return {
      "@timestamp": moment().format('l LTS'),
      "@version": "1",
      "message": errorInfo.message || errorInfo,
      "logger_name": "com.vatbox.stargate.StargateApp$",
      "thread_name": "Stargate-akka.actor.default-dispatcher-8",
      "level": "ERROR",
      "level_value": 10000
    };
  }*/

  /**
   * printError
   * @param {string} errorInfoLines
   */
  private printError(errorInfoLines: ErrorInfo): void {
    const failureLoggerStyle = [
      'background: red',
      'color: black',
      'display: block',
      'text-align: center',
    ].join(';');

    console.log('%c************** Error Occurred **************', failureLoggerStyle);
    console.dir(errorInfoLines);
    console.log('%c********************************************', failureLoggerStyle);
  }
}
