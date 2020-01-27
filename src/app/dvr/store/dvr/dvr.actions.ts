import { Action } from '@ngrx/store';

import { SimplifiedCountry } from '../../../common/services/configuration/configuration.model';
import {
  Account,
  AccountEntity,
  CreateDraftResponse,
  DvrStatistics,
  Refund,
} from '../../models/dvr.model';
import { RefundFlatNode } from '../../models/refund.model';

export enum DvrActionTypes {
  CreateDraft = '[API] [Dvr] Create Draft',
  CreateDraftSuccess = '[API] [Dvr] Create Draft Success',
  CreateDraftFail = '[API] [Dvr] Create Draft Fail',
  GetAccountStatistics = '[API] [Dvr] Get Account Statistics',
  GetAccountStatisticsSuccess = '[API] [Dvr] Get Account Statistics Success',
  GetAccountStatisticsFail = '[API] [Dvr] Get Account Statistics Fail',
  GetEntities = '[API] [Dvr] Get Entities',
  GetEntitiesSuccess = '[API] [Dvr] Get Entities Success',
  GetEntitiesFail = '[API] [Dvr] Get Entities Fail',
  GetEntityStatistics = '[API] [Dvr] Get Entity Statistics',
  GetEntityStatisticsSuccess = '[API] [Dvr] Get Entity Statistics Success',
  GetEntityStatisticsFail = '[API] [Dvr] Get Entity Statistics Fail',
  GetRefunds = '[API] [Dvr] Get Refunds',
  GetRefundsSuccess = '[API] [Dvr] Get Refunds Success',
  GetRefundsFail = '[API] [Dvr] Get Refunds Fail',
  LoadAccount = '[Dvr] Load Account',
  LoadAccountStatistics = '[Dvr] Load Account Statistics',
  LoadCountries = '[Dvr] Load Countries',
  LoadEntities = '[Dvr] Load Entities',
  LoadEntityStatistics = '[Dvr] Load Entity Statistics',
  LoadRefunds = '[Dvr] Load Refunds',
  ResetActiveEntityId = '[Dvr] Reset Active Entity Id',
  ResetDvr = '[Dvr] Reset Dvr',
  ResetSelectedFlatNodesOfEntity = '[Dvr] Reset Selected Flat Nodes Of Entity',
  SetActiveAccountId = '[Dvr] Set Active Account Id',
  SetActiveEntityId = '[Dvr] Set Active Entity Id',
  SetCountries = '[Dvr] Set Countries',
  SetSelectedFlatNodes = '[Dvr] Set Selected Flat Nodes',
}

/* CreateDraft */

export class CreateDraft implements Action {
  public readonly type = DvrActionTypes.CreateDraft;
}

export class CreateDraftSuccess implements Action {
  public readonly type = DvrActionTypes.CreateDraftSuccess;

  constructor(public payload: CreateDraftResponse) {}
}

export class CreateDraftFail implements Action {
  public readonly type = DvrActionTypes.CreateDraftFail;

  constructor(public payload: any) {}
}

/* GetAccountStatistics */

export class GetAccountStatistics implements Action {
  public readonly type = DvrActionTypes.GetAccountStatistics;
}

export class GetAccountStatisticsSuccess implements Action {
  public readonly type = DvrActionTypes.GetAccountStatisticsSuccess;
}

export class GetAccountStatisticsFail implements Action {
  public readonly type = DvrActionTypes.GetAccountStatisticsFail;

  constructor(public payload: any) {}
}

/* GetEntities */

export class GetEntities implements Action {
  public readonly type = DvrActionTypes.GetEntities;
}

export class GetEntitiesSuccess implements Action {
  public readonly type = DvrActionTypes.GetEntitiesSuccess;
}

export class GetEntitiesFail implements Action {
  public readonly type = DvrActionTypes.GetEntitiesFail;

  constructor(public payload: any) {}
}

/* GetEntityStatistics */

export class GetEntityStatistics implements Action {
  public readonly type = DvrActionTypes.GetEntityStatistics;
}

export class GetEntityStatisticsSuccess implements Action {
  public readonly type = DvrActionTypes.GetEntityStatisticsSuccess;
}

export class GetEntityStatisticsFail implements Action {
  public readonly type = DvrActionTypes.GetEntityStatisticsFail;

  constructor(public payload: any) {}
}

/* GetRefunds */

export class GetRefunds implements Action {
  public readonly type = DvrActionTypes.GetRefunds;
}

export class GetRefundsSuccess implements Action {
  public readonly type = DvrActionTypes.GetRefundsSuccess;
}

export class GetRefundsFail implements Action {
  public readonly type = DvrActionTypes.GetRefundsFail;

  constructor(public payload: any) {}
}

/* LoadAccount */

export class LoadAccount implements Action {
  public readonly type = DvrActionTypes.LoadAccount;

  constructor(public payload: { account: Account }) {}
}

/* LoadAccountStatistics */

export class LoadAccountStatistics implements Action {
  public readonly type = DvrActionTypes.LoadAccountStatistics;

  constructor(public payload: { accountId: number; statistics: DvrStatistics }) {}
}

/* LoadCountries */

export class LoadCountries implements Action {
  public readonly type = DvrActionTypes.LoadCountries;

  constructor(public payload: { countries: SimplifiedCountry[] }) {}
}

/* LoadEntities */

export class LoadEntities implements Action {
  public readonly type = DvrActionTypes.LoadEntities;

  constructor(public payload: { accountId: number; entities: AccountEntity[] }) {}
}

/* LoadEntityStatistics */

export class LoadEntityStatistics implements Action {
  public readonly type = DvrActionTypes.LoadEntityStatistics;

  constructor(public payload: { accountId: number; entityId: string; statistics: DvrStatistics }) {}
}

/* LoadRefunds */

export class LoadRefunds implements Action {
  public readonly type = DvrActionTypes.LoadRefunds;

  constructor(
    public payload: { accountId: number; countryCode: string; entityId: string; refunds: Refund[] },
  ) {}
}

/* ResetActiveEntityId */

export class ResetActiveEntityId implements Action {
  public readonly type = DvrActionTypes.ResetActiveEntityId;
}

/* ResetDvr */

export class ResetDvr implements Action {
  public readonly type = DvrActionTypes.ResetDvr;
}

/* ResetSelectedFlatNodesOfEntity */

export class ResetSelectedFlatNodesOfEntity implements Action {
  public readonly type = DvrActionTypes.ResetSelectedFlatNodesOfEntity;

  constructor(public payload: { accountId: number; entityId: string }) {}
}

/* SetActiveAccountId */

export class SetActiveAccountId implements Action {
  public readonly type = DvrActionTypes.SetActiveAccountId;

  constructor(public payload: { activeAccountId: number }) {}
}

/* SetActiveEntityId */

export class SetActiveEntityId implements Action {
  public readonly type = DvrActionTypes.SetActiveEntityId;

  constructor(public payload: { activeEntityId: string }) {}
}

/* SetCountries */

export class SetCountries implements Action {
  public readonly type = DvrActionTypes.SetCountries;
}

/* SetSelectedFlatNodes */

export class SetSelectedFlatNodes implements Action {
  public readonly type = DvrActionTypes.SetSelectedFlatNodes;

  constructor(
    public payload: {
      accountId: number;
      countryCode: string;
      entityId: string;
      selectedFlatNodes: RefundFlatNode[];
    },
  ) {}
}

export type DvrActions =
  | CreateDraft
  | CreateDraftSuccess
  | CreateDraftFail
  | GetAccountStatistics
  | GetAccountStatisticsSuccess
  | GetAccountStatisticsFail
  | GetEntities
  | GetEntitiesSuccess
  | GetEntitiesFail
  | GetEntityStatistics
  | GetEntityStatisticsSuccess
  | GetEntityStatisticsFail
  | GetRefunds
  | GetRefundsSuccess
  | GetRefundsFail
  | LoadAccount
  | LoadAccountStatistics
  | LoadCountries
  | LoadEntities
  | LoadEntityStatistics
  | LoadRefunds
  | ResetActiveEntityId
  | ResetDvr
  | ResetSelectedFlatNodesOfEntity
  | SetActiveAccountId
  | SetActiveEntityId
  | SetCountries
  | SetSelectedFlatNodes;
