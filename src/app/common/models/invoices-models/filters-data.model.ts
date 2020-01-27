import { Country } from '../../services/configuration/configuration.model';
import { CompanyGroup } from '../../services/gate/models/rails-data.model';

export interface FiltersData {
  company_group: CompanyGroup[];
  company: FilterItem[];
  expense_domain: FilterItem[];
  directive: FilterItem[];
  status: FilterItem[];
  reject_reason: FilterItem[];
  hq_branch: FilterItem[];
  agent: FilterItem[];
  origin_invoice_status: FilterItem[];
  invoice_category: FilterItem[];
}

export interface FilterItem {
  name: string;
  id: number;
  selected?: boolean;
  country?: string;
}

export interface GroupFilterItem extends FilterItem {
  child_ids: number[];
}

export interface FilteredCompaniesResponse {
  pages: number;
  companies: FilterItem[];
}

export interface FilteredGroupsResponse {
  pages: number;
  companies: GroupFilterItem[];
}

export interface CountryWithId extends Country {
  id: string;
}

export const FilterDataDictionary = {
  status: 'status',
  originalStatus: 'origin_invoice_status',
  rejectReason: 'reject_reason',
  expenseDomains: 'expense_domains',
  company: 'company',
  directive: 'directive',
  agent: 'agent',
  supplierAddress: 'hq_branch',
};

export const DataFromConf = ['country', 'originCountry', 'type'];

export const PrimitiveData = ['eligible', 'hasCopy', 'amountMin', 'amountMax', 'amountType'];

export const DatesControls = ['invoiceDate', 'submissionDate'];
