import { ServerResponse } from '../contracts/base-api';

export interface DeadcartVatRegistration {
  country: string;
  vatNumber: string;
  registrationYear: string;
  registrationDate?: string;
  registrationEndDate?: string;
  inScope?: boolean;
  currentRegistration?: boolean;
}

export interface DeadcartCompanyInfo {
  companyId: string;
  accountType: string;
  active: boolean;
  name: string;
  companyType: string;
  stage: string;
  country: string;
  domestic: boolean;
  vatRegistrations: DeadcartVatRegistration[];
  validNames?: string[];
  validGroupNames?: string[];
  invalidNames?: string[];
  legalName?: string;
  legalAddress?: string;
  vatId?: string;
  parent?: string;
}

export interface DeadcartCompanyInfoResponse extends ServerResponse {
  info?: DeadcartCompanyInfo;
}

export interface BulkCompaniesInfo {
  companiesInfo: DeadcartCompanyInfo[];
  failures: string[];
}
