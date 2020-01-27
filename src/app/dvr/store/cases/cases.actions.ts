import { Action } from '@ngrx/store';

import { Case, CaseStatistics } from '../../models/case.model';

export enum CasesActionTypes {
  GetCases = '[API] [Cases] Get Cases',
  GetCasesSuccess = '[API] [Cases] Get Cases Success',
  GetCasesFail = '[API] [Cases] Get Cases Fail',
  LoadCases = '[Cases] Load Cases',
  LoadStatistics = '[Cases] Load Statistics',
  RemoveCase = '[API] [Cases] Remove Cases',
  RemoveCaseSuccess = '[API] [Cases] Remove Cases Success',
  RemoveCaseFail = '[API] [Cases] Remove Cases Fail',
  ResetCasesState = '[Cases] Reset Cases State',
}

/* GetCases */

export class GetCases implements Action {
  public readonly type = CasesActionTypes.GetCases;
}

export class GetCasesSuccess implements Action {
  public readonly type = CasesActionTypes.GetCasesSuccess;
}

export class GetCasesFail implements Action {
  public readonly type = CasesActionTypes.GetCasesFail;

  constructor(public payload: any) {}
}

/* LoadCases */

export class LoadCases implements Action {
  public readonly type = CasesActionTypes.LoadCases;

  constructor(public payload: { cases: Case[] }) {}
}

/* LoadStatistics */

export class LoadStatistics implements Action {
  public readonly type = CasesActionTypes.LoadStatistics;

  constructor(public payload: { statistics: CaseStatistics }) {}
}

/* RemoveCase */

export class RemoveCase implements Action {
  public readonly type = CasesActionTypes.RemoveCase;
}

export class RemoveCaseSuccess implements Action {
  public readonly type = CasesActionTypes.RemoveCaseSuccess;
}

export class RemoveCaseFail implements Action {
  public readonly type = CasesActionTypes.RemoveCaseFail;

  constructor(public payload: any) {}
}

/* ResetCasesState */

export class ResetCasesState implements Action {
  public readonly type = CasesActionTypes.ResetCasesState;
}

export type CasesActions = LoadCases | LoadStatistics | ResetCasesState;
