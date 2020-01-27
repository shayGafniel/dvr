import { Action } from '@ngrx/store';

import { WorkEntity } from '../../models/work-dispatcher.model';

/* GetWorkEntities */

export class GetWorkEntities implements Action {
  public type = `[API] [${this.group}] Get Work Entities`;

  constructor(public readonly group: string) {}
}

export class GetWorkEntitiesSuccess implements Action {
  public type = `[API] [${this.group}] Get Work Entities Success`;

  constructor(public readonly group: string) {}
}

export class GetWorkEntitiesFail implements Action {
  public type = `[API] [${this.group}] Get Work Entities Fail`;

  constructor(public readonly group: string, public payload: any) {}
}

/* LoadWorkEntities */

export class LoadWorkEntities implements Action {
  public type = `[${this.group}] Load Work Entities`;

  constructor(public readonly group: string, public payload: { workEntities: WorkEntity[] }) {}
}

/* UpdateWorkEntities */

export class UpdateWorkEntities implements Action {
  public type = `[API] [${this.group}] Update Work Entities`;

  constructor(public readonly group: string) {}
}

export class UpdateWorkEntitiesSuccess implements Action {
  public type = `[API] [${this.group}] Update Work Entities Success`;

  constructor(public readonly group: string) {}
}

export class UpdateWorkEntitiesFail implements Action {
  public type = `[API] [${this.group}] Update Work Entities Fail`;

  constructor(public readonly group: string, public payload: any) {}
}

export type WorkEntitiesActions =
  | GetWorkEntities
  | GetWorkEntitiesSuccess
  | GetWorkEntitiesFail
  | LoadWorkEntities
  | UpdateWorkEntities
  | UpdateWorkEntitiesSuccess
  | UpdateWorkEntitiesFail;
