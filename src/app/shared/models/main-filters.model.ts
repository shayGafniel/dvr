import { FilterSelection } from '../../common/models/common.model';
import { TimeFrame } from '../../common/models/time-frame.model';
import { Country, Currency } from '../../common/services/configuration/configuration.model';
import { Company, CompanyGroup } from '../../common/services/gate/models/rails-data.model';

export enum ExpenseTypeBy {
  TES = 'TES',
  Vatbox = 'VATBox',
}
export const defaultExpenseTypeBy = ExpenseTypeBy.Vatbox;

export enum PaidBy {
  All = 'all',
  Others = 'Others',
  PCard = 'P-Card',
}
export enum TableauPaidBy {
  'Others' = 1,
  'P-Card' = 2,
}
export const defaultPaidBy = PaidBy.All;

export interface FilterDate {
  fromDate?: string;
  toDate?: string;
}

export interface MainFilters {
  amount_from?: number;
  amount_to?: number;
  companies?: Company[];
  company_group?: CompanyGroup; // Account
  countries?: Country[];
  currency?: Currency;
  currencyCode?: string;
  directives_invoices?: FilterSelection[];
  directives_reclaims?: FilterSelection[];
  expense_domains?: FilterSelection[];
  expense_type_by?: ExpenseTypeBy;
  expense_types?: FilterSelection[];
  invoice_id?: string;
  invoice_number?: string;
  invoiced_at_from?: string;
  invoiced_at_to?: string;
  origin_countries?: Country[];
  paid_by?: PaidBy;
  rate?: number;
  reclaim_id?: string;
  reject_reasons?: FilterSelection[];
  report_number?: string;
  scope_invoices?: string;
  scope_reclaims?: string;
  submission_authority?: number[];
  time_frame?: TimeFrame;
}

export interface MainFiltersInvoicedAt extends Partial<MainFilters> {
  invoiced_at_from: string;
  invoiced_at_to: string;
}

export type MainFiltersKey = keyof MainFilters;

export enum FilterPage {
  Dashboard = 'dashboard',
  Invoices = 'invoices',
  Reclaims = 'reclaims',
}

export enum FilterLabels {
  AmountFrom = 'Amount From',
  AmountTo = 'Amount To',
  Country = 'Destination Country',
  Currency = 'Currency',
  DirectiveInvoices = 'Scope',
  DirectiveReclaims = 'Scope ', // do not remove the space; it must be a unique string
  EntityName = 'Entity Name',
  ExpenseDomain = 'Expense Domain',
  ExpenseType = 'Expense Type',
  ExpenseTypeBy = 'Expense Type by',
  From = 'From',
  InvoiceId = 'Invoice ID',
  InvoiceNumber = 'Invoice #',
  NewLine = 'new line',
  OriginCountry = 'Origin Country',
  PaidBy = 'Paid by',
  ReclaimId = 'Reclaim ID',
  RejectedReason = 'Rejected Reason',
  ReportNumber = 'Report #',
  SubmissionAuthority = 'Submission Authority',
  TimeFrame = 'Time frame',
  To = 'To',
}

export const filtersKeyLabelMap = {
  amount_from: FilterLabels.AmountFrom,
  amount_to: FilterLabels.AmountTo,
  countries: FilterLabels.Country,
  currency: FilterLabels.Currency,
  directives_invoices: FilterLabels.DirectiveInvoices,
  directives_reclaims: FilterLabels.DirectiveReclaims,
  companies: FilterLabels.EntityName,
  expense_domains: FilterLabels.ExpenseDomain,
  expense_types: FilterLabels.ExpenseType,
  expense_type_by: FilterLabels.ExpenseTypeBy,
  invoiced_at_from: FilterLabels.From,
  invoice_id: FilterLabels.InvoiceId,
  invoice_number: FilterLabels.InvoiceNumber,
  origin_countries: FilterLabels.OriginCountry,
  paid_by: FilterLabels.PaidBy,
  reclaim_id: FilterLabels.ReclaimId,
  reject_reasons: FilterLabels.RejectedReason,
  report_number: FilterLabels.ReportNumber,
  submission_authority: FilterLabels.SubmissionAuthority,
  time_frame: FilterLabels.TimeFrame,
  invoiced_at_to: FilterLabels.To,
};

export type AdvanceFilters = { [id in FilterPage]: { label: FilterLabels; fxFlex?: string }[] };

export type BasicFilters = { [id in FilterPage]: FilterLabels[] };
