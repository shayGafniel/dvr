import { Action } from '@ngrx/store';
import { UserData } from './user-data.model';

export enum UserActionTypes {
  GetUserData = '[API] [User] Get User Data',
  GetUserDataSuccess = '[API] [User] Get User Data Success',
  GetUserDataFail = '[API] [User] Get User Data Fail',
  LoadUserData = '[User] Load User Data',
  SetIsAdmin = '[User] Set Is Admin',
}

export class GetUserData implements Action {
  public readonly type = UserActionTypes.GetUserData;
}

export class GetUserDataSuccess implements Action {
  public readonly type = UserActionTypes.GetUserDataSuccess;
}

export class GetUserDataFail implements Action {
  public readonly type = UserActionTypes.GetUserDataFail;

  public constructor(public payload: any) {}
}

export class LoadUserData implements Action {
  public readonly type = UserActionTypes.LoadUserData;

  public constructor(public payload: UserData) {}
}

export class SetIsAdmin implements Action {
  public readonly type = UserActionTypes.SetIsAdmin;

  public constructor(public isAdmin: boolean) {}
}

export type UserDataActions =
  | GetUserData
  | GetUserDataSuccess
  | GetUserDataFail
  | LoadUserData
  | SetIsAdmin;
