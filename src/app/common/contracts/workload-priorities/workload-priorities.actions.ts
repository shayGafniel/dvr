import { Action } from '@ngrx/store';

import { WorkloadPriority } from '../../models/work-dispatcher.model';

/* GetWorkloadPriorities */

export class GetWorkloadPriorities implements Action {
  public type = `[API] [${this.group}] Get Workload Priorities`;

  constructor(public readonly group: string) {}
}

export class GetWorkloadPrioritiesSuccess implements Action {
  public type = `[API] [${this.group}] Get Workload Priorities Success`;

  constructor(public readonly group: string) {}
}

export class GetWorkloadPrioritiesFail implements Action {
  public type = `[API] [${this.group}] Get Workload Priorities Fail`;

  constructor(public readonly group: string, public payload: any) {}
}

/* LoadWorkloadPriorities */

export class LoadWorkloadPriorities implements Action {
  public type = `[${this.group}] Load Workload Priorities`;

  constructor(
    public readonly group: string,
    public payload: { workloadPriorities: WorkloadPriority[] },
  ) {}
}

/* UpdateWorkloadPriorities */

export class UpdateWorkloadPriorities implements Action {
  public type = `[API] [${this.group}] Update Workload Priorities`;

  constructor(public readonly group: string) {}
}

export class UpdateWorkloadPrioritiesSuccess implements Action {
  public type = `[API] [${this.group}] Update Workload Priorities Success`;

  constructor(public readonly group: string) {}
}

export class UpdateWorkloadPrioritiesFail implements Action {
  public type = `[API] [${this.group}] Update Workload Priorities Fail`;

  constructor(public readonly group: string, public payload: any) {}
}

export type WorkloadPrioritiesActions =
  | GetWorkloadPriorities
  | GetWorkloadPrioritiesSuccess
  | GetWorkloadPrioritiesFail
  | LoadWorkloadPriorities
  | UpdateWorkloadPriorities
  | UpdateWorkloadPrioritiesSuccess
  | UpdateWorkloadPrioritiesFail;
