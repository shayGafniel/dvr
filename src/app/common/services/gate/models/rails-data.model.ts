export interface Company {
  name: string;
  id: number;
  country?: string;

}

export interface UserCompany extends Company {
  all_accounts: boolean;
}

export interface CompanyGroup extends Company {
  child_ids: number[];
}

export interface FilterOptions {
  invoice_category?: {
    id: number,
    name: string,
  }[];
  reject_reason?: {
    id: number,
    name: string,
  }[];
}

export interface TaxTailorImaginaryIdsParams {
  entity_id: string;
  reason: string;
  country_code: string;
  sub_reason?: string;
}

export interface TaxTailorEntitiesParams {
  account_id: string;
}
