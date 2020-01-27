import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';

import { HttpCall } from '../error-handler/error-handler.model';
import { deepcopy } from '../../utils/utils';

const MAX_CHARS = 21;
const MAX_ELEMENTS = 3;

@Injectable()
export class LoggerService {
  private lastCalls: HttpCall[] = [];

  // Log
  public addLog(httpRespBase: HttpResponseBase, body: any): void {
    try {
      const serverRespBody =
        httpRespBase instanceof HttpErrorResponse ? httpRespBase.error : httpRespBase['body'];
      let trimmedJson = deepcopy(serverRespBody);
      if (typeof serverRespBody === 'object') {
        try {
          trimmedJson = this.trimJson(trimmedJson);
        } catch (e) {}
      }
      const log: HttpCall = {
        ts: new Date().toString(),
        body: JSON.stringify(body),
        url: httpRespBase.url,
        response: `${httpRespBase.status}: ${trimmedJson}`,
      };
      this.addToLastCallsArray(log);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * getLastCallArray
   */
  public getLastCallArray(): HttpCall[] {
    return this.lastCalls;
  }

  /**
   * isSvgRequest
   * @param {string} url
   * @return {boolean}
   */
  private isSvgRequest(url: string): boolean {
    return !!url && url.includes('.svg');
  }

  /**
   * addToLastCallsArray
   */
  private addToLastCallsArray(log: HttpCall): void {
    if (!this.isSvgRequest(log.url)) {
      if (this.lastCalls.length === 10) {
        this.lastCalls.shift();
      }
      this.lastCalls.push(log);
    }
  }

  /**
   * trimJson (Recursive method)
   * Trim
   * @param serverResponse
   * @return {string}
   */
  private trimJson(serverResponse): string {
    if (!serverResponse) {
      return serverResponse;
    }
    if (typeof serverResponse === 'string') {
      return `${serverResponse.slice(0, MAX_CHARS)}${
        serverResponse.length < MAX_CHARS ? '' : '...'
      }`;
    }
    if (Array.isArray(serverResponse)) {
      const numOfTrimElems = serverResponse.length - MAX_ELEMENTS;
      const newArr = serverResponse.slice(0, MAX_ELEMENTS).map(elem => this.trimJson(elem));
      return `${newArr.toString()}${numOfTrimElems > 0 ? `...(Trimmed: ${numOfTrimElems})` : ''}`;
    }
    for (const [key, value] of Object.entries(serverResponse)) {
      serverResponse[key] = this.trimJson(value);
    }
    return JSON.stringify(serverResponse);
  }
}
