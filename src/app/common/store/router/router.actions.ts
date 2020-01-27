import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Action } from '@ngrx/store';

export const GO = '[Router] Go';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';

export class Go implements Action {
  public readonly type = GO;

  constructor(
    public payload: {
      path: any[];
      query?: object;
      extras?: NavigationExtras;
      relativeTo?: () => ActivatedRoute;
    },
  ) {}
}

export class Back implements Action {
  public readonly type = BACK;
}

export class Forward implements Action {
  public readonly type = FORWARD;
}

export type RouterActionsUnion = Go | Back | Forward;
