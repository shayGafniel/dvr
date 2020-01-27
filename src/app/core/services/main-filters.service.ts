import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { isEqual, isObject, omit } from 'lodash-es';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, share, skip, skipWhile, take, withLatestFrom } from 'rxjs/operators';

import { AppState } from '~/common/store/reducers';
import { MainFilters } from '~/shared/models/main-filters.model';
import { CommonUtil } from '~/shared/utils/common.util';
import {
  initialState,
  selectPreparedMainFilters as selectInitMainFilters,
} from '../store/main-filters/main-filters.reducer';
import {
  selectAccount,
  selectPreparedMainFilters,
  State,
} from '../store/reducers';

import { selectCompanies } from '~/common/services/store/reducers';
import {
  companyAllValueId,
  getInvoiceDirectivesOptions,
  getReclaimDirectivesOptions,
} from '~/shared/configurations/filter.configuration';
import { MainFiltersUtil } from '~/shared/utils/main-filters.util';
import { FilterSelection } from '~/common/models/common.model';

@Injectable()
export class MainFiltersService {
  public readonly preparedMainFiltersChanges$: Observable<Partial<MainFilters>> = this.store.pipe(
    withLatestFrom(
      this.store.pipe(select(selectAccount)),
      this.store.pipe(select(selectPreparedMainFilters)),
      this.store.pipe(select(selectCompanies)),
      (state, account, preparedFilters, allCompanies) => {
        const filters = { ...preparedFilters };
        filters.company_group = {
          id: account.accountId,
          name: account.accountName,
          country: account.countryCode,
          child_ids: [],
        };

        if (this.noCompanyFilter(filters)) {
          filters.companies = allCompanies;
        }
        return filters;
      },
    ),
    distinctUntilChanged(isEqual),
    skipWhile(this.noCompanyFilter),
    map(mainFilter => {
      const previousMainFilters = this.previousMainFilters;
      this.previousMainFilters = mainFilter;

      return CommonUtil.changesBetween(previousMainFilters, mainFilter);
    }),
    skip(1),
    share(),
  );

  private previousMainFilters: MainFilters = selectInitMainFilters(initialState);

  constructor(
    private store: Store<AppState & State>
  ) {
  }

  public getDefaultFilters(): Observable<Partial<MainFilters>> {
    return this.store.pipe(
      withLatestFrom(
        this.store.pipe(select(selectAccount)),
        this.store.pipe(select(selectPreparedMainFilters)),
        this.store.pipe(select(selectCompanies)),
        (state, account, preparedFilters, allCompanies) => {
          const filters = { ...preparedFilters };
          filters.company_group = {
            id: account.accountId,
            name: account.accountName,
            country: account.countryCode,
            child_ids: [],
          };
          if (MainFiltersUtil.noCompaniesFilled(filters)) {
            filters.companies = allCompanies;
          }
          return filters;
        },
      ),
      filter((filters) => isObject(filters.company_group)),
      skipWhile(this.noCompanyFilter),
      map(filters => omit(filters, ['invoiced_at_from', 'invoiced_at_to'])),
      take(1),
    );
  }

  public mapDirectives(values: FilterSelection[], toType = 'invoices') {
    const res = [];
    const mapping = toType === 'reclaims' ? getReclaimDirectivesOptions() : getInvoiceDirectivesOptions();
    values.forEach((value) => {
      res.push(mapping.find(i => i.viewValue === value.viewValue));
    });
    return res;
  }

  private noCompanyFilter(filters): boolean {
    return filters.companies[0] && filters.companies[0].id === companyAllValueId;
  }
}
