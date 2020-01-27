import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromCommon from '~/common/services/store/reducers';
import { FilterPage } from '~/shared/models/main-filters.model';
import * as fromMainFilters from './main-filters/main-filters.reducer';

export interface State extends fromCommon.State {
  mainFilters: fromMainFilters.State;
}

export const reducers: ActionReducerMap<State> = {
  mainFilters: fromMainFilters.reducer,
  configuration: fromCommon.reducers.configuration,
  cropping: fromCommon.reducers.cropping,
  deadcart: fromCommon.reducers.deadcart,
  expedite: fromCommon.reducers.expedite,
  matcher: fromCommon.reducers.matcher,
  p1: fromCommon.reducers.p1,
  p2: fromCommon.reducers.p2,
  p2Expert: fromCommon.reducers.p2Expert,
  p3: fromCommon.reducers.p3,
  scapeLamb: fromCommon.reducers.scapeLamb,
  gateRails: fromCommon.reducers.gateRails,
  userData: fromCommon.reducers.userData,
};

export const selectFeatureState = createFeatureSelector<State>('core');

/* MainFilters */

export const selectMainFiltersState = createSelector(
  selectFeatureState,
  (state: State) => state.mainFilters,
);
export const selectMainFilters = createSelector(
  selectMainFiltersState,
  fromMainFilters.selectMainFilters,
);
export const selectMainFiltersCount = (filterPage: FilterPage) =>
  createSelector(selectMainFilters, mainFilters =>
    fromMainFilters.selectMainFiltersCountByPage(mainFilters, filterPage),
  );
export const selectIsPristineMainFilters = createSelector(
  selectMainFilters,
  fromMainFilters.selectIsPristineMainFilters,
);
export const selectPreparedInvoicedAt = createSelector(
  selectMainFiltersState,
  fromMainFilters.selectPreparedInvoicedAt,
);
export const selectPreparedMainFilters = createSelector(
  selectMainFiltersState,
  fromMainFilters.selectPreparedMainFilters,
);

/* Account */

export const selectAccount = createSelector(selectMainFiltersState, fromMainFilters.selectAccount);
export const selectAccountId = createSelector(
  selectMainFiltersState,
  fromMainFilters.selectAccountId,
);

/* Currency */
export const selectCurrency = createSelector(
  selectMainFiltersState,
  fromMainFilters.selectCurrency,
);

export const selectRate = createSelector(selectMainFiltersState, fromMainFilters.selectRate);
