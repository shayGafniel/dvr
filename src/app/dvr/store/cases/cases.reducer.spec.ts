import * as fromActions from './cases.actions';
import { initialState, reducer, selectCases, selectCasesListCounts } from './cases.reducer';
import { CaseStatisticsType } from '../../models/case.model';
import { CasesListCounts, SummaryCountsType } from '../../models/cases-list-counts.model';
import { DvrMock } from '../../services/dvr-api/dvr.mock';

export const casesResponse = DvrMock.getCasesResponse();
export const cases = casesResponse.cases;
export const statistics = casesResponse.statistics;

const casesListCounts: CasesListCounts = {
  [SummaryCountsType.Approved]: {
    amount: statistics[CaseStatisticsType.Approved].amount,
    count: statistics[CaseStatisticsType.Approved].count,
  },
  [SummaryCountsType.Draft]: {
    amount: statistics[CaseStatisticsType.Draft].amount,
    count: statistics[CaseStatisticsType.Draft].count,
  },
  [SummaryCountsType.Total]: {
    amount:
      statistics[CaseStatisticsType.Approved].amount + statistics[CaseStatisticsType.Draft].amount,
    count:
      statistics[CaseStatisticsType.Approved].count + statistics[CaseStatisticsType.Draft].count,
  },
};

export const stateWithCases = reducer(initialState, new fromActions.LoadCases({ cases }));
export const stateWithStatistics = reducer(
  initialState,
  new fromActions.LoadStatistics({ statistics }),
);

describe('Cases Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('LoadCases', () => {
    it('should fill the cases field', () => {
      const action = new fromActions.LoadCases({ cases });

      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, cases });
    });
  });

  describe('LoadStatistics', () => {
    it('should fill the statistics field', () => {
      const action = new fromActions.LoadStatistics({ statistics });

      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, statistics });
    });
  });

  describe('selectCases', () => {
    it('should return cases', () => {
      expect(selectCases(stateWithCases)).toEqual(cases);
    });
  });

  describe('selectCasesListCounts', () => {
    it('should return cases', () => {
      expect(selectCasesListCounts(stateWithStatistics)).toEqual(casesListCounts);
    });
  });
});
