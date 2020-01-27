import { Action } from '@ngrx/store';

export enum ScapeLambActionTypes {
  GetWorkloadsNames = '[API] [ScapeLamb] Get Workloads Names',
  GetWorkloadsNamesSuccess = '[API] [ScapeLamb] Get Workloads Names Success',
  GetWorkloadsNamesFail = '[API] [ScapeLamb] Get Workloads Names Fail',
  LoadWorkloadsNames = '[ScapeLamb] Load Workloads Names',
}

/* GetWorkloadsNames */

export class GetWorkloadsNames implements Action {
  public readonly type = ScapeLambActionTypes.GetWorkloadsNames;
}

export class GetWorkloadsNamesSuccess implements Action {
  public readonly type = ScapeLambActionTypes.GetWorkloadsNamesSuccess;
}

export class GetWorkloadsNamesFail implements Action {
  public readonly type = ScapeLambActionTypes.GetWorkloadsNamesFail;

  constructor(public payload: any) {}
}

/* LoadWorkloadsNames */

export class LoadWorkloadsNames implements Action {
  public readonly type = ScapeLambActionTypes.LoadWorkloadsNames;

  constructor(public payload: { ids: string[]; names: string[] }) {}
}

export type ScapeLambActions =
  | GetWorkloadsNames
  | GetWorkloadsNamesSuccess
  | GetWorkloadsNamesFail
  | LoadWorkloadsNames;
