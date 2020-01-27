import { Action } from '@ngrx/store';
import { Company, CompanyGroup } from '../../gate/models/rails-data.model';
import { FiltersData } from '../../../models/invoices-models/filters-data.model';
import { InvoicesOptions } from '../../../models/invoices-models/invoice.model';

export enum GateRailsActionTypes {
  GetCompanyGroupsByAccount = '[Gate Rails] Get Company Groups By Account',
  GetCompanyGroupsByAccountFail = '[Gate Rails] Get Company Groups By Account Fail',
  GetCompanyGroupsByAccountSuccess = '[Gate Rails] Get Company Groups By Account Success',
  LoadCompanyGroupsByAccount = '[Gate Rails] Load Company Groups By Account',
  GetCompaniesByAccount = '[Gate Rails] Get Companies By Account',
  GetCompaniesByAccountFail = '[Gate Rails] Get Companies By Account Fail',
  GetCompaniesByAccountSuccess = '[Gate Rails] Get Companies By Account Success',
  LoadCompaniesByAccount = '[Gate Rails] Load Companies By Account',
  GetFilterOptions = '[Gate Rails] Get Filter Options',
  GetFilterOptionsSuccess = '[Gate Rails] Get Filter Options Success',
  GetFilterOptionsFail = '[Gate Rails] Get Filter Options Fail',
  LoadFilterOptions = '[Gate Rails] Load Filter Options',
  ClearCompanies = '[Gate Rails] Clear Companies On Account Change'
}

export class GetCompanyGroupsByAccount implements Action {
  public readonly type = GateRailsActionTypes.GetCompanyGroupsByAccount;
  public constructor(public payload: number) {} // Account Id
}

export class GetCompanyGroupsByAccountFail implements Action {
  public readonly type = GateRailsActionTypes.GetCompanyGroupsByAccountFail;

  public constructor(public payload: any) {}
}

export class GetCompanyGroupsByAccountSuccess implements Action {
  public readonly type = GateRailsActionTypes.GetCompanyGroupsByAccountSuccess;
}

export class LoadCompanyGroupsByAccount implements Action {
  public readonly type = GateRailsActionTypes.LoadCompanyGroupsByAccount;

  public constructor(public payload: CompanyGroup[]) {}
}

export class GetCompaniesByAccount implements Action {
  public readonly type = GateRailsActionTypes.GetCompaniesByAccount;
  public constructor(public payload: number) {} // Account Id
}

export class GetCompaniesByAccountFail implements Action {
  public readonly type = GateRailsActionTypes.GetCompaniesByAccountFail;

  public constructor(public payload: any) {}
}

export class GetCompaniesByAccountSuccess implements Action {
  public readonly type = GateRailsActionTypes.GetCompaniesByAccountSuccess;
}

export class LoadCompaniesByAccount implements Action {
  public readonly type = GateRailsActionTypes.LoadCompaniesByAccount;

  public constructor(public payload: Company[]) {}
}

export class GetFilterOptions implements Action {
  public readonly type = GateRailsActionTypes.GetFilterOptions;

  public constructor(public payload: keyof FiltersData) {}
}

export class GetFilterOptionsSuccess implements Action {
  public readonly type = GateRailsActionTypes.GetFilterOptionsSuccess;
}

export class GetFilterOptionsFail implements Action {
  public readonly type = GateRailsActionTypes.GetFilterOptionsFail;

  public constructor(public payload: any) {}
}

export class LoadFilterOptions implements Action {
  public readonly type = GateRailsActionTypes.LoadFilterOptions;

  public constructor(public payload: InvoicesOptions) {}
}

export class ClearCompanies implements Action {
  public readonly type = GateRailsActionTypes.ClearCompanies;
}

export type GateRailsActions =
  GetCompanyGroupsByAccount
  | GetCompanyGroupsByAccountFail
  | GetCompanyGroupsByAccountSuccess
  | LoadCompanyGroupsByAccount
  | GetCompaniesByAccount
  | GetCompaniesByAccountFail
  | GetCompaniesByAccountSuccess
  | LoadCompaniesByAccount
  | GetFilterOptions
  | GetFilterOptionsSuccess
  | GetFilterOptionsFail
  | LoadFilterOptions
  | ClearCompanies;

