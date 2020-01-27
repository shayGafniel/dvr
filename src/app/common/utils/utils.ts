import { take } from 'lodash-es';
import * as moment from 'moment';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { months } from 'moment';

export type AsyncJobToken = any;

export function range(start: number, end: number, step?: number): number[] {
  if (!step) step = 1;

  const isDescending = step > 0;

  const len = Math.abs(end - start);

  // noinspection TypeScriptUnresolvedFunction
  const rangeArr = Array.from(Array(len).keys())
    .map(key => key + (isDescending ? start : end + 1))
    .filter((_, index) => index % step === 0);

  if (!isDescending) return rangeArr.reverse();
  return rangeArr;
}

export function unique(array) {
  return array.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
}

/**
 * Function Name dateOnlyToFormatString
 * @param {Date | string} date
 * @returns {string} that represent a date in a ${format}
 */
export function dateOnlyToFormatString(date: Date | string): string {
  const format = 'YYYY-MM-DD';
  if (typeof date === 'undefined' || date === null || date === '') return;
  return moment(date).format(format);
}

export function dateRailsToFormatString(date: Date | string): string {
  const format = 'DD-MM-YYYY';
  if (typeof date === 'undefined' || date === null || date === '') return;
  return moment(date).format(format);
}

export function getDateByFormat(date: string, format: string): Date {
  if (typeof date === 'undefined') return;
  return moment(date, format).toDate();
}

export function getDateStringByFormat(date: Date, format: string): string {
  if (typeof date === 'undefined') return;
  return moment(date).format(format);
}

// returns date form url by format
export function dateFromUrlByFormat(date: string, format: string): string {
  if (typeof date === 'undefined') return;
  return moment(decodeURIComponent(date), format, true).format();
}

export function calcTimeFrameFormToday(timeFrame: any) {
  const timeCode = {
    y: 'years',
    m: 'months',
  };
  return { fromDate: moment().subtract(timeFrame[0], timeCode[timeFrame[1]]).format('DD-MM-YYYY'), toDate: moment().format('DD-MM-YYYY') };
}

/*** this function accept a typed homogene array (inputArray) of primitive or json objects
 and sorts it, in case the type is 'undefined' it returns an empty array - [],
 heterogene typed arrays are invalid, sorting JSONs by properties nested in array members is not supported

 pay attention! this function changes its input array  ***/
export function orderBy(
  inputArray: Array<any>,
  isAscending = true,
  fieldsNames: Array<string> = [],
): Array<any> {
  let argumentIdxPivot = 0;

  const recursiveCompareObjects = (a: any, b: any) => {
    if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
      argumentIdxPivot = 0;
      return a.toString() < b.toString() ? -1 : a.toString() > b.toString() ? 1 : 0;
    } else {
      return recursiveCompareObjects(
        a[fieldsNames[argumentIdxPivot]],
        b[fieldsNames[argumentIdxPivot++]],
      );
    }
  };

  if (typeof inputArray[0] === 'undefined') return [];
  else if (
    typeof inputArray[0] === 'string' ||
    typeof inputArray[0] === 'number' ||
    typeof inputArray[0] === 'boolean'
  ) {
    inputArray.sort();
  } else if (typeof inputArray[0] === 'object') {
    inputArray.sort(recursiveCompareObjects);
  } else {
    console.error('type is not supported');
    return [];
  }
  if (!isAscending) {
    inputArray.reverse();
  }
  return inputArray;
}

export function hasIntersection(a: Array<string | number>, b: Array<string | number>): boolean {
  return a.filter(item => b.includes(item)).length > 0;
}

export function sortByAttributes(array, ...attrs): Array<any> {
  const predicates = attrs.map(pred => {
    const descending = pred.charAt(0) === '-' ? -1 : 1;
    pred = pred.replace(/^-/, '');
    return {
      getter: o => o[pred],
      descend: descending,
    };
  });

  return array
    .map(item => {
      return {
        src: item,
        compareValues: predicates.map(predicate => predicate.getter(item)),
      };
    })
    .sort((o1, o2) => {
      let i = -1,
        result = 0;
      while (++i < predicates.length) {
        if (o1.compareValues[i] instanceof Date) {
          if (o1.compareValues[i].getTime() < o2.compareValues[i].getTime()) result = -1;
          if (o1.compareValues[i].getTime() > o2.compareValues[i].getTime()) result = 1;
          // this is a for eligibility - sort by countries code
        } else if (typeof o1.compareValues[i] === 'object') {
          if (typeof o1.compareValues[i].code !== 'undefined') {
            if (o1.compareValues[i].code < o2.compareValues[i].code) result = -1;
            if (o1.compareValues[i].code > o2.compareValues[i].code) result = 1;
          } else if (typeof o1.compareValues[i].id !== 'undefined') {
            if (Number(o1.compareValues[i].id) < Number(o2.compareValues[i].id)) result = -1;
            if (Number(o1.compareValues[i].id) > Number(o2.compareValues[i].id)) result = 1;
          }
        } else {
          if (o1.compareValues[i] < o2.compareValues[i]) result = -1;
          if (o1.compareValues[i] > o2.compareValues[i]) result = 1;
        }

        if ((result *= predicates[i].descend)) break;
      }
      return result;
    })
    .map(item => item.src);
}

export abstract class BackofficeError<T> extends Error {
  constructor(public code: T, public message: string, public asyncJobToken?: AsyncJobToken) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BackofficeError.prototype);
  }
}

export function removeNodes(selector: string): void {
  const elements = document.querySelectorAll(selector);
  for (let i = 0; i < elements.length; ++i) {
    elements[i].parentNode.removeChild(elements[i]);
  }
}

export function safeMap<T>(array: T[], fn: (value: T, index: number, array: T[]) => T): T[] {
  if (!Array.isArray(array)) {
    return [];
  }
  return array.map(fn);
}

export function stringFromAny(data: any): string {
  if (data && typeof data === 'object') {
    return JSON.stringify(data);
  }

  if (!data && ['undefined', 'object'].indexOf(typeof data) !== -1) {
    return '';
  }

  return data.toString();
}

export function isEmptyString(str: any): boolean {
  return typeof str === 'string' && str.trim() === '';
}

export class ActionId {
  private static actionId;
  public static actionSeparator = '_';

  /**
   * getActionId
   * @return {string}
   */
  public static getActionId(): string {
    return ActionId.actionId;
  }

  /**
   * setActionId
   * @param {string} stationName
   * @return {string}
   */
  public static setActionId(stationName: string): void {
    const uniqueId = Math.random()
      .toString(36)
      .replace('0.', '');
    ActionId.actionId = [stationName, uniqueId].join(ActionId.actionSeparator);
  }
}

export class ApplicationHttpErrorCode {
  private static httpError = null;

  public static get lastHttpError(): number | null {
    return ApplicationHttpErrorCode.httpError;
  }

  public static set lastHttpError(httpErrorCode: number) {
    ApplicationHttpErrorCode.httpError = httpErrorCode;
  }
}

export function isFilledArray(array: Array<any>): boolean {
  return Array.isArray(array) && Boolean(array.length);
}

/**
 * Deep copy object
 * @param json
 * @return {any}
 */
export function deepcopy(json: any = null): any {
  return typeof json === 'object' ? JSON.parse(JSON.stringify(json)) : json;
}

// link to un-cropped screen (for production, staging or local)
export const getBaseUrl: () => string = () => {
  return new RegExp('k8rnd').test(window.location.href)
    ? 'https://backoffice.k8rnd.vatbox.com'
    : new RegExp('localhost:4200').test(window.location.href)
      ? 'http://localhost:4200'
      : 'https://backoffice.vatbox.com';
};

// returns url string starts from '?'
export function concatQueryParamsToUrlQueryString(paramsObj: any): string {
  let paramsAsString: string = '?';
  let isFirstParam: boolean = true;
  Object.keys(paramsObj).forEach(key => {
    if (!!paramsObj[key]) {
      if (paramsObj[key] instanceof Array) {
        (paramsObj[key] as Array<any>).map((val: any) => {
          paramsAsString = `${paramsAsString}${isFirstParam ? '' : '&'}${key}=${val}`;
          isFirstParam = false;
        });
      } else {
        paramsAsString = `${paramsAsString}${isFirstParam ? '' : '&'}${key}=${paramsObj[key]}`;
      }
      isFirstParam = false;
    }
  });
  return paramsAsString;
}

// get key by values of an object (return the 1st occurrence)
export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

/*** snake to camel case
 * Example: snakeToCamelCase(reject_reason) => rejectReason
 * ***/
export function snakeToCamel(s: string) {
  return s.replace(/(\_\w)/g, function(m) {
    return m[1].toUpperCase();
  });
}

export function convertObjectKeysSnakeToCamelCase(object: Object): Object {
  const result = {};
  Object.keys(object).map((key: string) => {
    result[snakeToCamel(key)] = object[key];
  });
  return result;
}

// when ngrx store return not-writable - make
export function makeObjectWritable(object: any): any {
  return typeof object === 'object' ? Object.assign({}, object) : object;
}

export function makeObjectsArrayWritable(objects: Array<any>): Array<any> {
  return objects.map(object => makeObjectWritable(object));
}

/**
 * Read about use cases here
 * https://medium.com/@m3po22/stop-using-ngrx-effects-for-that-a6ccfe186399
 */
export const muteFirst = <T, R>(first$: Observable<T>, second$: Observable<R>): Observable<R> => {
  return combineLatest(first$, second$).pipe(
    map(([a, b]: [T, R]): R => b),
    distinctUntilChanged(),
  );
};

export const multiplyArray = <T>(array: T[], n: number): T[] => {
  return range(0, n < 0 ? 0 : n).reduce((accumulator: T[]) => [...accumulator, ...array], []);
};

export const takeAndFill = <T>(array: T[], n: number): T[] => {
  return take(multiplyArray(array, Math.ceil(n / array.length)), n);
};
