import { GateRailsActions, GateRailsActionTypes } from './gate-rails.actions';
import { Company, CompanyGroup } from '../../gate/models/rails-data.model';
import { InvoicesOptions } from '../../../models/invoices-models/invoice.model';

export interface State {
  companies: Company[];
  companyGroups?: CompanyGroup[];
  filterOptions?: InvoicesOptions;
}

export const initialState: State = {
  companies: [],
  companyGroups: [],
  filterOptions: {
    invoice_category: [],
    reject_reason: [],
  }
};

export function reducer(state = initialState, action: GateRailsActions): State {
  switch (action.type) {
    case GateRailsActionTypes.GetCompanyGroupsByAccount:
    case GateRailsActionTypes.GetCompaniesByAccount: {
      return { ...state };
    }

    case GateRailsActionTypes.LoadCompanyGroupsByAccount: {
      return { ...state, companyGroups: [...action.payload] };
    }

    case GateRailsActionTypes.LoadCompaniesByAccount: {
      return { ...state, companies: [...action.payload] };
    }

    case GateRailsActionTypes.LoadFilterOptions: {
      return { ...state, filterOptions: { ...state.filterOptions, ...action.payload }};
    }

    case GateRailsActionTypes.ClearCompanies: {
      return { ...state, companies: [] };
    }

    default:
      return state;
  }
}

export const selectCompanies = (state: State): Company[] => state.companies;

export const selectCompanyGroups = (state: State): CompanyGroup[] => state.companyGroups;

export const selectFilterOptions = (state: State): InvoicesOptions => state.filterOptions;
