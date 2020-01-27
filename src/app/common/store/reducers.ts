import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { RouterStateUrl } from './router/router.serializer';

export interface AppState {
  router: RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
};

export const selectRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>(
  'router',
);
export const selectRouter = createSelector(
  selectRouterState,
  router => (router ? router.state : router),
);
