import { Conf, Currency } from '../../configuration/configuration.model';
import { ConfigurationActionTypes, ConfigurationActions } from './configuration.actions';
import { MultiSelectOption } from '../../../models/multy-select.model';

export interface State {
  configuration: Conf;
}

export const initialState: State = {
  configuration: {
    countries: [],
    currencies: [],
    categories: [],
    commonCurrencies: [],
    categoryAliases: [],
    allCountries: [],
    allCurrencies: [],
  },
};

export function reducer(state = initialState, action: ConfigurationActions): State {
  switch (action.type) {
    case ConfigurationActionTypes.LoadConfigurationData:
      return { ...state, configuration: action.payload };

    default:
      return state;
  }
}

export const selectConfiguration = (state: State): Conf => state.configuration;

export const selectCountryOptions = (state: State): MultiSelectOption[] =>
  selectConfiguration(state).countries.map(country => ({
    display: country.name,
    value: country.code,
  }));

export const selectCurrencies = (state: State): Currency[] => selectConfiguration(state).currencies;
