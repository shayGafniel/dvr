import { DeadcartActions, DeadcartActionTypes } from './deadcart.actions';
import { DeadcartCompanyInfo } from '../../../models/deadcart.model';

export interface State {
  companiesInfo: DeadcartCompanyInfo[];
  failures: string[];
}

export const initialState: State = {
  companiesInfo: [],
  failures: [],
};

export function reducer(state = initialState, action: DeadcartActions): State {
  switch (action.type) {
    case DeadcartActionTypes.LoadBulkCompaniesInfo:
      return { ...state, ...action.payload.bulkCompaniesInfo };

    default:
      return state;
  }
}

export const selectCompaniesInfo = (state: State, ids: string[]): DeadcartCompanyInfo[] => {
  return state.companiesInfo.filter(companyInfo => ids.includes(companyInfo.companyId));
};

export const selectFailures = (state: State, ids: string[]): string[] => {
  return state.failures.filter(failure => ids.includes(failure.toString()));
};
