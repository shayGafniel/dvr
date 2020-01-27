import { Action } from '@ngrx/store';

export enum ClarificationFormActionTypes {
  DisableClarification = '[ClarificationForm] Disable Clarification',
  FillClarification = '[ClarificationForm] Fill Clarification',
  InitClarifications = '[ClarificationForm] Init Clarifications',
}

export class DisableClarification implements Action {
  public readonly type = ClarificationFormActionTypes.DisableClarification;

  constructor(public payload: { entityId: string }) {}
}

export class FillClarification implements Action {
  public readonly type = ClarificationFormActionTypes.FillClarification;

  constructor(public payload: { clarification: string; entityId: string }) {}
}

export class InitClarifications implements Action {
  public readonly type = ClarificationFormActionTypes.InitClarifications;

  constructor(public payload: { entityIds: string[] }) {}
}

export type ClarificationFormActions =
  | DisableClarification
  | FillClarification
  | InitClarifications;
