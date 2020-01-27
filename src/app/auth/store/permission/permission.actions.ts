import { Action } from '@ngrx/store';

export enum PermissionActionTypes {
  GetUserPermissions = '[API] [Permission] Get User Permissions',
}

export class GetUserPermissions implements Action {
  public readonly type = PermissionActionTypes.GetUserPermissions;
  constructor(public payload: any) {}
}

export type PermissionActions = GetUserPermissions;
