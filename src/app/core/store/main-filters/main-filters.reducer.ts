import { find, omit } from 'lodash-es';

import { TimeFrame } from '../../../common/models/time-frame.model';
import { Account } from '../../../common/services/account/account.model';
import { advancedFilters, getCompanyAllValue } from '../../../shared/configurations/filter.configuration';
import {
  defaultExpenseTypeBy,
  defaultPaidBy,
  FilterPage,
  filtersKeyLabelMap,
  MainFilters,
  MainFiltersInvoicedAt,
} from '../../../shared/models/main-filters.model';
import { CommonUtil } from '../../../shared/utils/common.util';
import { MainFiltersUtil } from '../../../shared/utils/main-filters.util';
import { MainFiltersActions, MainFiltersActionTypes } from './main-filters.actions';

export interface State {
  mainFilters: MainFilters;
  account: Account;
}

export const initialState: State = {
  mainFilters: {
    companies: [getCompanyAllValue()],
    expense_type_by: defaultExpenseTypeBy,
    paid_by: defaultPaidBy,
    time_frame: TimeFrame.CurrentYear,
    currencyCode: 'EUR',
    rate: 1,
  },
  account: { accountId: -1, accountName: '', countryCode: '' },
};

export function reducer(state = initialState, action: MainFiltersActions): State {
  switch (action.type) {
    case MainFiltersActionTypes.ResetMainFilters:
      return {
        ...state,
        mainFilters: {
          ...initialState.mainFilters,
          company_group: state.mainFilters.company_group,
          currencyCode: state.mainFilters.currencyCode,
          rate: state.mainFilters.rate,
        },
      };

    case MainFiltersActionTypes.SetAccount:
      return { ...state, account: action.payload };

    case MainFiltersActionTypes.SetMainFilters:
      return {
        ...state,
        mainFilters: {
          ...action.payload.mainFilters,
          company_group: state.mainFilters.company_group,
        },
      };

    case MainFiltersActionTypes.SetCurrencyAndRate:
      return { ...state, mainFilters: { ...state.mainFilters, ...action.payload } };

    case MainFiltersActionTypes.SetTimeFrame:
      return {
        ...state,
        mainFilters: CommonUtil.clearObject({
          ...state.mainFilters,
          company_group: state.mainFilters.company_group,
          invoiced_at_from: initialState.mainFilters.invoiced_at_from,
          invoiced_at_to: initialState.mainFilters.invoiced_at_to,
          time_frame: action.payload.time_frame,
        }),
      };

    case MainFiltersActionTypes.UpdateMainFilters:
      return {
        ...state,
        mainFilters: CommonUtil.clearObject({
          ...state.mainFilters,
          ...action.payload,
        }),
      };

    default:
      return state;
  }
}

export const selectMainFilters = (state: State): MainFilters => state.mainFilters;

const selectMainFiltersChanges = (mainFilters: MainFilters): Array<keyof MainFilters> => {
  const preparedFilters = omit(mainFilters, ['company_group', 'scope_invoices', 'scope_reclaims']);

  if (preparedFilters.time_frame === TimeFrame.Custom) {
    preparedFilters.time_frame = initialState.mainFilters.time_frame;
  }

  return Object.keys(CommonUtil.changesBetween(initialState.mainFilters, preparedFilters)) as Array<
    keyof MainFilters
  >;
};

const selectMainFiltersCount = (mainFilters: MainFilters): number => {
  return selectMainFiltersChanges(mainFilters).length;
};

export const selectIsPristineMainFilters = (mainFilters: MainFilters): boolean =>
  selectMainFiltersCount(mainFilters) === 0;

export const selectMainFiltersCountByPage = (
  mainFilters: MainFilters,
  filterPage: FilterPage,
): number => {
  const changes = selectMainFiltersChanges(mainFilters);

  const filtered = changes.filter(change =>
    find(advancedFilters[filterPage], ['label', filtersKeyLabelMap[change]]),
  );

  return filtered.length;
};

export const selectPreparedInvoicedAt = (state: State): MainFiltersInvoicedAt =>
  MainFiltersUtil.getInvoicedAt(state.mainFilters);

export const selectPreparedMainFilters = (state: State): MainFilters => {
  return CommonUtil.clearObject({
    ...state.mainFilters,
    ...selectPreparedInvoicedAt(state),
    time_frame: undefined,
  });
};

export const selectAccount = (state: State): Account => state.account;

export const selectAccountId = (state: State): number => state.account.accountId;

export const selectCurrency = (state: State): string => state.mainFilters.currencyCode;

export const selectRate = (state: State): number => state.mainFilters.rate;

// export const selectFromDate = (state: State): string => state.mainFilters.invoiced_at_from;
//
// export const selectToDate = (state: State): string => state.mainFilters.invoiced_at_to;
