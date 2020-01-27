import { FilterSelection } from '../../common/models/common.model';
import { Country, Currency } from '../../common/services/configuration/configuration.model';
import { Company } from '../../common/services/gate/models/rails-data.model';
import {
  AdvanceFilters,
  BasicFilters,
  ExpenseTypeBy,
  FilterLabels,
  FilterPage,
} from '../models/main-filters.model';

export const getActiveOptions: () => FilterSelection[] = () => {
  return [
    { value: 'all', viewValue: 'All' },
    { value: true, viewValue: 'Enabled' },
    { value: false, viewValue: 'Disabled' },
  ];
};

export const getEntityIndications: () => FilterSelection[] = () => {
  return [
    { value: 'all', viewValue: 'All' },
    { value: 'standard', viewValue: 'Standard' },
    { value: 'group', viewValue: 'Group' },
  ];
};

export const getInvoiceDirectivesOptions: () => FilterSelection[] = () => {
  return [
    { value: 0, viewValue: 'All' },
    { value: 1, viewValue: 'Directive 8' },
    { value: 2, viewValue: 'Domestic' },
    { value: 4, viewValue: 'Directive 13' },
    { value: 6, viewValue: 'Foreign Vat Registration' },
  ];
};

export const getReclaimDirectivesOptions: () => FilterSelection[] = () => {
  return [
    { value: 0, viewValue: 'All' },
    { value: 2, viewValue: 'Directive 8' },
    { value: 4, viewValue: 'Domestic' },
    { value: 1, viewValue: 'Directive 13' },
    { value: 3, viewValue: 'Foreign Vat Registration' },
  ];
};

export const getExpenseDomainOptions: () => FilterSelection[] = () => {
  return [
    { value: -1, viewValue: 'All' },
    { value: 0, viewValue: 'T&E' },
    { value: 1, viewValue: 'AP' },
    { value: 2, viewValue: 'AP Audit' },
    { value: 3, viewValue: 'Inter-company' },
    { value: 4, viewValue: 'Conferences' },
  ];
};

export const getExpenseTypeByOptions: () => FilterSelection<ExpenseTypeBy>[] = () => {
  return [
    { value: ExpenseTypeBy.Vatbox, viewValue: ExpenseTypeBy.Vatbox },
    { value: ExpenseTypeBy.TES, viewValue: ExpenseTypeBy.TES },
  ];
};

export const getSubmissionAuthorityOptions: () => FilterSelection<number>[] = () => {
  return [
    { viewValue: 'Tax Authorities', value: 1 },
    { viewValue: 'Invoices issuer', value: 2 },
    { viewValue: 'Internal', value: 3 },
    { viewValue: 'Other', value: 4 },
  ];
};

export const companyAllValueId = -1;
export const getCompanyAllValue = (): Company => ({ name: 'All', id: companyAllValueId });
export const getDirectivesAllValue = (): FilterSelection[] => [getInvoiceDirectivesOptions()[0]];
export const getExpenseDomainsAllValue = (): FilterSelection[] => [getExpenseDomainOptions()[0]];
export const getCountriesAllValue = (): Country[] => [{ code: 'All', name: 'All' }];
export const getCurrencyAllValue = (): Currency[] => [{ code: 'All', name: 'All', symbol: '' }];
export const getAllValue = (): FilterSelection[] => [{ value: -1, viewValue: 'All' }];

export const advancedFilters: AdvanceFilters = {
  [FilterPage.Dashboard]: [
    {
      label: FilterLabels.ExpenseTypeBy,
      fxFlex: '',
    },
    {
      label: FilterLabels.NewLine,
    },
    {
      label: FilterLabels.TimeFrame,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.From,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.To,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.EntityName,
      fxFlex: '100%',
    },
    {
      label: FilterLabels.OriginCountry,
      fxFlex: 'calc(50% - 12px)',
    },
    {
      label: FilterLabels.Country,
      fxFlex: 'calc(50% - 12px)',
    },
    {
      label: FilterLabels.DirectiveInvoices,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.ExpenseDomain,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.PaidBy,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.ExpenseType,
      fxFlex: '100%',
    },
    {
      label: FilterLabels.NewLine,
    },
  ],
  [FilterPage.Invoices]: [
    {
      label: FilterLabels.InvoiceId,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.NewLine,
      fxFlex: 'calc(66% - 12px)',
    },
    {
      label: FilterLabels.TimeFrame,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.From,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.To,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.EntityName,
      fxFlex: '100%',
    },
    {
      label: FilterLabels.OriginCountry,
      fxFlex: 'calc(50% - 12px)',
    },
    {
      label: FilterLabels.Country,
      fxFlex: 'calc(50% - 12px)',
    },
    {
      label: FilterLabels.DirectiveInvoices,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.ExpenseDomain,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.ExpenseType,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.AmountFrom,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.AmountTo,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.Currency,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.InvoiceNumber,
      fxFlex: 'calc(50% - 12px)',
    },
    {
      label: FilterLabels.PaidBy,
      fxFlex: 'calc(50% - 12px)',
    },
    {
      label: FilterLabels.ReportNumber,
      fxFlex: 'calc(50% - 12px)',
    },
    {
      label: FilterLabels.RejectedReason,
      fxFlex: 'calc(50% - 12px)',
    },
    {
      label: FilterLabels.NewLine,
    },
  ],
  [FilterPage.Reclaims]: [
    {
      label: FilterLabels.ReclaimId,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.NewLine,
      fxFlex: 'calc(66% - 12px)',
    },
    {
      label: FilterLabels.TimeFrame,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.From,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.To,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.EntityName,
      fxFlex: '100%',
    },
    {
      label: FilterLabels.Country,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.DirectiveReclaims,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.SubmissionAuthority,
      fxFlex: 'calc(33% - 12px)',
    },
    {
      label: FilterLabels.NewLine,
    },
  ],
};

export const basicFilters: BasicFilters = {
  [FilterPage.Dashboard]: [
    FilterLabels.ExpenseTypeBy,
    FilterLabels.TimeFrame,
    FilterLabels.EntityName,
  ],
  [FilterPage.Invoices]: [
    FilterLabels.InvoiceId,
    FilterLabels.TimeFrame,
    FilterLabels.DirectiveInvoices,
  ],
  [FilterPage.Reclaims]: [
    FilterLabels.ReclaimId,
    FilterLabels.TimeFrame,
    FilterLabels.Country,
    FilterLabels.DirectiveReclaims,
  ],
};
