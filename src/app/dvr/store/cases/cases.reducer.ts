import { CasesActions, CasesActionTypes } from './cases.actions';
import { Case, CaseStatistics, CaseStatisticsType } from '../../models/case.model';
import { CasesListCounts, SummaryCountsType } from '../../models/cases-list-counts.model';

export interface State {
  cases: Case[];
  statistics: CaseStatistics;
}

export const initialState: State = {
  cases: null,
  statistics: {
    [CaseStatisticsType.Approved]: {
      amount: 0,
      count: 0,
    },
    [CaseStatisticsType.Draft]: {
      amount: 0,
      count: 0,
    },
  },
};

export function reducer(state = initialState, action: CasesActions): State {
  switch (action.type) {
    case CasesActionTypes.LoadCases:
      return { ...state, ...action.payload };

    case CasesActionTypes.LoadStatistics:
      return { ...state, ...action.payload };

    case CasesActionTypes.ResetCasesState:
      return initialState;

    default:
      return state;
  }
}

export const selectCases = (state: State): Case[] => state.cases;

export const selectCasesListCounts = (state: State): CasesListCounts => {
  return {
    [SummaryCountsType.Approved]: {
      amount: state.statistics[CaseStatisticsType.Approved].amount || 0,
      count: state.statistics[CaseStatisticsType.Approved].count || 0,
    },
    [SummaryCountsType.Draft]: {
      amount: state.statistics[CaseStatisticsType.Draft].amount || 0,
      count: state.statistics[CaseStatisticsType.Draft].count || 0,
    },
    [SummaryCountsType.Total]: {
      amount:
        state.statistics[CaseStatisticsType.Approved].amount +
        state.statistics[CaseStatisticsType.Draft].amount,
      count:
        state.statistics[CaseStatisticsType.Approved].count +
        state.statistics[CaseStatisticsType.Draft].count,
    },
  };
};
