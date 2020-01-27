import { isNumber, mean, round } from 'lodash-es';

import { DashboardActions, DashboardActionTypes } from './dashboard.actions';
import { Dashboard } from '../../models/dashboard.model';
import { DashboardGraphs } from '../../models/dashboard-graphs.model';
import { DashboardPromotions } from '~/dashboard/models/dashboard-promotions.model';
import { DashboardTopRow } from '~/dashboard/models/dashboard-top-row.model';

export interface State {
  data: {
    dashboard: Dashboard;
    dashboardGraphs: DashboardGraphs;
    dashboardPromotions: DashboardPromotions;
    dashboardTopRow: DashboardTopRow;
  };
  pendingRequests: {
    dashboard: boolean;
    dashboardGraphs: boolean;
    dashboardPromotions: boolean;
    dashboardTopRow: boolean;
  };
  error: string;
  pending: boolean;
}

const dashboardInit: Dashboard = {
  refundPotential: 0,
  recoveryPotentialByData: 0,

  overallSubmitted: 0,
  submittedReissued: 0,
  pendingSubmission: 0,
  pendingSubmissionReissued: 0,

  disqualified: 0,
  needYourInput: 0,
  needYourInputCount: 0,
  pendingReissue: 0,

  overallRefunded: 0,
  overallRefundedReissued: 0,
  pendingApproval: 0,
  pendingApprovalReissued: 0,

  incorrectCharges: 0,
  rejected: 0,
};

const dashboardGraphsInit: DashboardGraphs = {
  refunded: [],
  submitted: [],
  potential: [],
  disqualified: [],
  disqualifiedAvg: 0,
  labels: [],
};

const dashboardPromotionsInit: DashboardPromotions = {
  taxTailor: 0,
  vendorDirect: 0,
  complianceTrainer: 0,
};

const dashboardTopRowInit: DashboardTopRow = {
  annual_te_spend: 0,
  spent_by_pulled_data: 0,
  te_spent_gap: 0,
  out_of_scope: 0,
  not_eligible: 0,
};

export const initialState: State = {
  data: {
    dashboard: dashboardInit,
    dashboardGraphs: dashboardGraphsInit,
    dashboardPromotions: dashboardPromotionsInit,
    dashboardTopRow: dashboardTopRowInit,
  },
  pendingRequests: {
    dashboard: true,
    dashboardGraphs: true,
    dashboardPromotions: true,
    dashboardTopRow: true,
  },
  error: '',
  pending: true,
};

export function reducer(state = initialState, action: DashboardActions): State {
  switch (action.type) {
    case DashboardActionTypes.GetDashboard:
      return changeStateOnLoading(state, {}, 'dashboard', true);
    case DashboardActionTypes.GetDashboardGraphs:
      return changeStateOnLoading(state, {}, 'dashboardGraphs', true);
    case DashboardActionTypes.GetDashboardTopRow:
      return changeStateOnLoading(state, {}, 'dashboardTopRow', true);
    case DashboardActionTypes.GetDashboardPromotions:
      return changeStateOnLoading(state, {}, 'dashboardPromotions', true);

    case DashboardActionTypes.GetDashboardFail:
      return changeStateOnLoading(state, {}, 'dashboard', false, action.payload.toString());
    case DashboardActionTypes.GetDashboardGraphsFail:
      return changeStateOnLoading(state, {}, 'dashboardGraphs', false, action.payload.toString());
    case DashboardActionTypes.GetDashboardTopRowFail:
      return changeStateOnLoading(state, {}, 'dashboardTopRow', false, action.payload.toString());
    case DashboardActionTypes.GetDashboardPromotionsFail:
      return changeStateOnLoading(state, {}, 'dashboardPromotions', false, action.payload.toString());

    case DashboardActionTypes.GetDashboardSuccess:
      return changeStateOnLoading(state, {}, 'dashboard', false);
    case DashboardActionTypes.GetDashboardGraphsSuccess:
      return changeStateOnLoading(state, {}, 'dashboardGraphs', false);
    case DashboardActionTypes.GetDashboardTopRowSuccess:
      return changeStateOnLoading(state, {}, 'dashboardTopRow', false);
    case DashboardActionTypes.GetDashboardPromotionsSuccess:
      return changeStateOnLoading(state, {}, 'dashboardPromotions', false);

    case DashboardActionTypes.LoadDashboard:
      return { ...state, data: { ...state.data, ...action.payload } };

    case DashboardActionTypes.LoadDashboardGraphs:
      return {
        ...state,
        data: {
          ...state.data,
          dashboardGraphs: {
            ...action.payload.dashboardGraphs,
            disqualifiedAvg: round(mean(action.payload.dashboardGraphs.disqualified)),
          },
        },
      };

    case DashboardActionTypes.LoadDashboardPromotions:
      return {
        ...state,
        data: {
          ...state.data,
          dashboardPromotions: { ...action.payload.dashboardPromotions }
        }
      };

    case DashboardActionTypes.LoadDashboardTopRow:
      return { ...state, data: { ...state.data, ...action.payload } };

    default:
      return state;
  }
}

export const selectDashboard = (state: State): Dashboard => state.data.dashboard;

export const selectDashboardGraphs = (state: State): DashboardGraphs => state.data.dashboardGraphs;

export const selectDashboardGraphsMax = (state: State): number => {
  const graphs = selectDashboardGraphs(state);

  return Object.values(graphs).reduce((max: number, graph: number[] | string[]) => {
    if (isNumber(graph[0])) {
      const maxInGraph = Math.max(...(graph as number[]));

      return maxInGraph > max ? maxInGraph : max;
    }
    return max;
  }, 0);
};

export const selectDashboardGraphsMaxDisqualified = (state: State): number =>
  Math.max(...selectDashboardGraphs(state).disqualified);

export const selectDashboardPromotions = (state: State): DashboardPromotions => state.data.dashboardPromotions;

export const selectDashboardTopRow = (state: State): DashboardTopRow => state.data.dashboardTopRow;

function changeStateOnLoading(state, payload, flagKey, flagValue, error = '') {
  const pendingRequests = {
    ...state.pendingRequests,
    [flagKey]: flagValue,
  };
  return {
    ...state,
    pendingRequests: pendingRequests,
    pending: Object.values(pendingRequests).some(i => i === true),
    error: error,
  };
}
