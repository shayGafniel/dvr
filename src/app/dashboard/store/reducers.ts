import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromDashboard from './dashboard/dashboard.reducer';

export interface State {
  dashboard: fromDashboard.State;
}

export const reducers: ActionReducerMap<State> = {
  dashboard: fromDashboard.reducer,
};

export const selectFeatureState = createFeatureSelector<State>('dashboard');

/* Dashboard */

export const selectDashboardState = createSelector(
  selectFeatureState,
  (state: State) => state.dashboard,
);
export const selectDashboard = createSelector(selectDashboardState, fromDashboard.selectDashboard);
export const selectDashboardGraphs = createSelector(
  selectDashboardState,
  fromDashboard.selectDashboardGraphs,
);
export const selectDashboardGraphsMax = createSelector(
  selectDashboardState,
  fromDashboard.selectDashboardGraphsMax,
);
export const selectDashboardGraphsMaxDisqualified = createSelector(
  selectDashboardState,
  fromDashboard.selectDashboardGraphsMaxDisqualified,
);
export const selectDashboardPromotions = createSelector(
  selectDashboardState,
  fromDashboard.selectDashboardPromotions,
);

export const selectDashboardTopRow = createSelector(
  selectDashboardState,
  fromDashboard.selectDashboardTopRow,
);

export const selectDashboardIsLoading = createSelector(
  selectDashboardState,
  (state) => state.pending,
);
