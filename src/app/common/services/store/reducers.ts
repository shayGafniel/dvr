import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromConfiguration from './configuration/configuration.reducer';
import * as fromCropping from './cropping/cropping.reducer';
import * as fromDeadcart from './deadcart/deadcart.reducer';
import * as fromExpedite from './expedite/expedite.reducer';
import * as fromMatcher from './matcher/matcher.reducer';
import * as fromP1 from './p1/p1.reducer';
import * as fromP2 from './p2/p2.reducer';
import * as fromP2Expert from './p2-expert/p2-expert.reducer';
import * as fromP3 from './p3/p3.reducer';
import * as fromScapeLamb from './scape-lamb/scape-lamb.reducer';
import * as fromGateRails from './gate-rails/gate-rails.reducer';
import * as fromUserData from './user-data/user-data.reducer';

export interface State {
  configuration: fromConfiguration.State;
  cropping: fromCropping.State;
  deadcart: fromDeadcart.State;
  expedite: fromExpedite.State;
  matcher: fromMatcher.State;
  p1: fromP1.State;
  p2: fromP2.State;
  p2Expert?: fromP2Expert.State;
  p3: fromP3.State;
  scapeLamb: fromScapeLamb.State;
  gateRails: fromGateRails.State;
  userData: fromUserData.State;
}

export const reducers: ActionReducerMap<State> = {
  configuration: fromConfiguration.reducer,
  cropping: fromCropping.reducer,
  deadcart: fromDeadcart.reducer,
  expedite: fromExpedite.reducer,
  matcher: fromMatcher.reducer,
  p1: fromP1.reducer,
  p2: fromP2.reducer,
  p2Expert: fromP2Expert.reducer,
  p3: fromP3.reducer,
  scapeLamb: fromScapeLamb.reducer,
  gateRails: fromGateRails.reducer,
  userData: fromUserData.reducer,
};

export const selectFeatureState = createFeatureSelector<State>('core');

/* Configuration */

export const selectConfigurationState = createSelector(
  selectFeatureState,
  (state: State) => state.configuration,
);
export const selectConfiguration = createSelector(
  selectConfigurationState,
  fromConfiguration.selectConfiguration,
);
export const selectCountryOptions = createSelector(
  selectConfigurationState,
  fromConfiguration.selectCountryOptions,
);
export const selectCurrencies = createSelector(
  selectConfigurationState,
  fromConfiguration.selectCurrencies,
);

/* Cropping */

export const selectCroppingState = createSelector(
  selectFeatureState,
  (state: State) => state.cropping,
);
export const selectCroppingWorkEntities = createSelector(
  selectCroppingState,
  fromCropping.selectWorkEntities,
);

/* Deadcart */

export const selectDeadcartState = createSelector(
  selectFeatureState,
  (state: State) => state.deadcart,
);

/* Expedite */

export const selectExpediteState = createSelector(
  selectFeatureState,
  (state: State) => state.expedite,
);
export const selectExpediteWorkloadPriorities = createSelector(
  selectExpediteState,
  fromExpedite.selectWorkloadPriorities,
);

/* Matcher */

export const selectMatcherState = createSelector(
  selectFeatureState,
  (state: State) => state.matcher,
);
export const selectMatcherWorkEntities = createSelector(
  selectMatcherState,
  fromMatcher.selectWorkEntities,
);

/* P1 */

export const selectP1State = createSelector(
  selectFeatureState,
  (state: State) => state.p1,
);
export const selectP1WorkloadPriorities = createSelector(
  selectP1State,
  fromP1.selectWorkloadPriorities,
);

/* P2 */

export const selectP2State = createSelector(
  selectFeatureState,
  (state: State) => state.p2,
);
export const selectP2WorkloadPriorities = createSelector(
  selectP2State,
  fromP2.selectWorkloadPriorities,
);

/* P2 Expert */

export const selectP2ExpertState = createSelector(
  selectFeatureState,
  (state: State) => state.p2Expert,
);
export const selectP2ExpertWorkloadPriorities = createSelector(
  selectP2ExpertState,
  fromP2Expert.selectWorkloadPriorities,
);

/* P3 */

export const selectP3State = createSelector(
  selectFeatureState,
  (state: State) => state.p3,
);
export const selectP3WorkloadPriorities = createSelector(
  selectP3State,
  fromP3.selectWorkloadPriorities,
);

/* Scape Lamb */

export const selectScapeLambState = createSelector(
  selectFeatureState,
  (state: State) => state.scapeLamb,
);

/* Gate Rails */

export const selectGateRailsState = createSelector(
  selectFeatureState,
  (state: State) => state.gateRails,
);
export const selectCompanies = createSelector(
  selectGateRailsState,
  fromGateRails.selectCompanies,
);
export const selectCompanyGroups = createSelector(
  selectGateRailsState,
  fromGateRails.selectCompanyGroups,
);

export const selectFilterOptionsState = createSelector(
  selectGateRailsState,
  fromGateRails.selectFilterOptions,
);

/* User Data */

export const selectUserDataState = createSelector(
  selectFeatureState,
  (state: State) => state.userData,
);
export const selectIsAdmin = createSelector(
  selectUserDataState,
  fromUserData.selectIsAdmin,
);
export const selectUserData = createSelector(
  selectUserDataState,
  fromUserData.selectUser,
);
export const selectUserEmail = createSelector(
  selectUserDataState,
  fromUserData.selectUserEmail,
);

/* Rails filters */

export const selectFilterOptionsFromRails = createSelector(
  selectGateRailsState,
  fromGateRails.selectFilterOptions,
);
