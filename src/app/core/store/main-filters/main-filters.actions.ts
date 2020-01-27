import { Action } from '@ngrx/store';

import { TimeFrame } from '../../../common/models/time-frame.model';
import { Account } from '../../../common/services/account/account.model';
import { MainFilters } from '../../../shared/models/main-filters.model';

export enum MainFiltersActionTypes {
  ResetMainFilters = '[Filter] Reset Main Filters',
  SetAccount = '[Account] Set Account',
  SetCompanyGroup = '[Account] Set Company Group',
  SetCurrencyAndRate = '[Currency] Set Currency And Rate',
  SetMainFilters = '[Filter] Set Main Filters',
  SetTimeFrame = '[Filter] Set Time Frame',
  UpdateMainFilters = '[Filter] Update Main Filters',
}

/* ResetMainFilters */

export class ResetMainFilters implements Action {
  public readonly type = MainFiltersActionTypes.ResetMainFilters;
}

/* SetAccount */

export class SetAccount implements Action {
  public readonly type = MainFiltersActionTypes.SetAccount;

  public constructor(public payload: Account) {
  }
}

/* SetCompanyGroup */

export class SetCompanyGroup implements Action {
  public readonly type = MainFiltersActionTypes.SetCompanyGroup;
}

/* SetCurrencyAndRate */

export class SetCurrencyAndRate implements Action {
  public readonly type = MainFiltersActionTypes.SetCurrencyAndRate;

  public constructor(public payload: {currencyCode: string, rate: number}) {
  }
}

/* SetMainFilters */

export class SetMainFilters implements Action {
  public readonly type = MainFiltersActionTypes.SetMainFilters;

  public constructor(public payload: { mainFilters: MainFilters }) {}
}

/* SetTimeFrame */

export class SetTimeFrame implements Action {
  public readonly type = MainFiltersActionTypes.SetTimeFrame;

  public constructor(public payload: { time_frame: TimeFrame }) {}
}

/* UpdateMainFilters */

export class UpdateMainFilters implements Action {
  public readonly type = MainFiltersActionTypes.UpdateMainFilters;

  public constructor(public payload: MainFilters) {}
}

export type MainFiltersActions =
  | ResetMainFilters
  | SetAccount
  | SetCompanyGroup
  | SetCurrencyAndRate
  | SetMainFilters
  | SetTimeFrame
  | UpdateMainFilters;
