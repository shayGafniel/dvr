/// <reference types="tableau" />

import { MainFiltersKey } from './main-filters.model';

export enum TableauFilterKey {
  CompanyId = 'Company_Id_str',
  Directive = 'Directive_Field',
  ExpenseDomain = 'Expense_Domain',
  GroupName = 'Group_Name',
  InvoicedAt = 'Invoiced_At',
  Country = 'Destination Country',
  OriginCountry = 'Origin_Country',
  PaidBy = 'paid_by',
  ExpenseType = 'Category_Id',
}

export enum TableauParamKey {
  ExpenseTypeBy = 'VATBoxOrTES',
  CurrencyCode = 'Currency_Code',
  CurrencyRate = 'conversionRateMultipleCurrency',
}

export type TableauFilters = {
  [key in Exclude<TableauFilterKey, TableauFilterKey.InvoicedAt>]: any;
};

export const resetFilters: TableauFilters = {
  [TableauFilterKey.CompanyId]: '',
  [TableauFilterKey.Directive]: '',
  [TableauFilterKey.ExpenseDomain]: '',
  [TableauFilterKey.GroupName]: '',
  [TableauFilterKey.Country]: '',
  [TableauFilterKey.OriginCountry]: '',
  [TableauFilterKey.PaidBy]: '',
  [TableauFilterKey.ExpenseType]: '',
};

type VizCreateOptions = Pick<tableau.VizCreateOptions, keyof TableauOptions>;

export interface TableauOptions extends TableauFilters, VizCreateOptions {
  hideTabs: boolean;
  hideToolbar: boolean;
  width: string;
  height: string;
  onFirstInteractive: () => void;
}

export interface TableauTicket {
  key: string;
}

export interface TableauSheet extends tableau.Sheet {
  getWorksheets(): tableau.Worksheet[];
}

export interface TableauDateRange {
  min: Date;
  max: Date;
}

type TableauFiltersKeyMap = Partial<Record<MainFiltersKey, string>>;

export type MainFiltersMappedKey = keyof TableauFiltersKeyMap;

export type TableauValue = string | string[] | TableauDateRange;

export const tableauFiltersKeyMap: TableauFiltersKeyMap = {
  companies: TableauFilterKey.CompanyId,
  company_group: TableauFilterKey.GroupName,
  countries: TableauFilterKey.Country,
  origin_countries: TableauFilterKey.OriginCountry,
  paid_by: TableauFilterKey.PaidBy,
  directives_invoices: TableauFilterKey.Directive,
  expense_domains: TableauFilterKey.ExpenseDomain,
  invoiced_at_from: TableauFilterKey.InvoicedAt,
  invoiced_at_to: TableauFilterKey.InvoicedAt,
  expense_types: TableauFilterKey.ExpenseType,

};

export const tableauParamsKeyMap: TableauFiltersKeyMap = {
  expense_type_by: TableauParamKey.ExpenseTypeBy,
  currencyCode: TableauParamKey.CurrencyCode,
  rate: TableauParamKey.CurrencyRate,
};
