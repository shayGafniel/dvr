import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ActionId } from '../../../utils/utils';

// Todo:
// Should not be as a service but as an http interceptor
// The logic inside intercept should be surrounded with a private method
// The if block contains 4 conditions
// Comments are missing

const HEADER_NAME = 'X-Action-Token';

@Injectable()
export class ActionIdInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * intercept
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @return {Observable<HttpEvent<any>>}
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const actionId = ActionId.getActionId();
    let stationNameFromActionId = null;
    let stationNameFromUrl = null;
    try {
      stationNameFromActionId = actionId.split(ActionId.actionSeparator)[0];
      stationNameFromUrl = window.location.pathname.split('/')[1];
    } catch (e) {}

    if (
      actionId &&
      stationNameFromActionId &&
      stationNameFromActionId.includes(stationNameFromUrl) &&
      !req.url.includes('.svg')
    ) {
      const clonedRequest = req.clone({ headers: req.headers.set(HEADER_NAME, actionId) });
      return next.handle(clonedRequest);
    }
    return next.handle(req);
  }
}
