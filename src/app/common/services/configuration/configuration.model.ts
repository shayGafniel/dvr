export interface Icon {
  svg?: string;
  png?: string;
}

export interface Country {
  code: string;
  name: string;
  currencyCode?: string;
  icon?: Icon;
  groups?: Array<string>;
  vatString?: string | Array<any>; // todo ngConfiguration bug (Nir should handle it)
  rates?: Array<any>;
  topLevelDomain?: string;
  supported?: VATBoxSupport;
  cities?: Array<City>; // only for canada
  taxTypes?: Array<TaxType>; // only for canada
  provinces?: Array<Province>; // only for canada
}

export interface City {
  name: string;
  provinceCode: string;
}

export interface TaxType {
  name: string;
  id: number;
}

export interface Province {
  name: string;
  code: string;
  concept?: string;
  gstRate?: number;
  conceptRate?: number;
  taxTypes?: string[];
}

export interface Province {
  name: string;
  code: string;
}

export interface City {
  name: string;
  provinceCode: string;
}

export interface SimplifiedCountry {
  code: string;
  name: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  supported?: VATBoxSupport;
}

export interface Category {
  id: string;
  name: string;
  shortName: string;
  icon: Icon;
  isAuthorityCategory?: boolean; // required from backend optional for backwards compatibility of backoffice specs
  supported?: string;
  group?: Array<string>;
  mappingCategory?: {
    id: number;
    shortName: string;
  };
}

export interface CategoryAsOnBackend {
  id: number;
  name: string;
  shortName: string;
  icon: Icon;
  isAuthorityCategory?: boolean;
  supported?: string;
  group?: Array<string>;
  mappingCategory?: {
    id: number;
    shortName: string;
  };
}

export interface Conf {
  countries: Country[];
  currencies: Currency[];
  categories: Category[];
  commonCurrencies: Currency[];
  categoryAliases?: Category[];
  allCountries: Country[];
  allCurrencies: Currency[];
}

export interface VatStrings {
  [s: string]: string;
}

export type VATBoxSupport = 'supported' | 'notSupported';

export interface P2DocumentType {
  documentType: string; // english
  documentTypeTextForUi: string; // local language
}

export interface P2VatRatesResponseBody {
  rateByType: Array<P2VatRatesResponseBodyItem>;
}

export interface P2VatRatesResponseBodyItem {
  expType: string;
  rate: number;
  openedAsDefault: boolean;
}

// countries & currencies are those who supported by VATBox, allCountries & allCurrencies includes non-supported - can be get by anyCountryByCode anyCurrencyByCode
export class Configuration {
  public countriesByCode: Map<string, Country>;
  public allCountriesByCode: Map<string, Country>;
  public currenciesByCode: Map<string, Currency>;
  public allCurrenciesByCode: Map<string, Currency>;
  public categoriesById: Map<string, Category>;
  public commonCurrenciesByCode: Map<string, Currency>;
  private _categories: Category[];
  private _vatStrings: VatStrings;
  private _categoryAliases: Category[];

  set countries(countries: Country[]) {
    this.countriesByCode = new Map<string, Country>();
    countries.map(country => this.countriesByCode.set(country.code, country));
  }

  public countryByCode(code: string): Country {
    return this.countriesByCode.get(code);
  }

  set allCountries(countries: Country[]) {
    this.allCountriesByCode = new Map<string, Country>();
    countries.map(country => this.allCountriesByCode.set(country.code, country));
  }

  public anyCountryByCode(code: string): Country {
    return this.allCountriesByCode.get(code);
  }

  set currencies(currencies: Currency[]) {
    this.currenciesByCode = new Map<string, Currency>();
    currencies.map(currency => this.currenciesByCode.set(currency.code, currency));
  }

  set allCurrencies(currencies: Currency[]) {
    this.allCurrenciesByCode = new Map<string, Currency>();
    currencies.map(currency => this.allCurrenciesByCode.set(currency.code, currency));
  }

  public currencyByCode(code: string): Currency {
    return this.currenciesByCode.get(code);
  }

  public anyCurrencyByCode(code: string): Currency {
    return this.allCurrenciesByCode.get(code);
  }

  set categories(categories: Category[]) {
    this.categoriesById = new Map<string, Category>();
    categories.map(category => this.categoriesById.set(category.id, category));
    this._categories = categories;
  }

  get categories() {
    return this._categories;
  }

  public categoryById(id: string): Category {
    return this.categoriesById.get(id);
  }

  set vatStrings(vatStrings: VatStrings) {
    this._vatStrings = vatStrings;
  }

  public vatStringByCode(code: string): string {
    return this._vatStrings[code];
  }

  set commonCurrencies(commonCurrencies: Currency[]) {
    this.commonCurrenciesByCode = new Map<string, Currency>();
    commonCurrencies.map(currency => this.commonCurrenciesByCode.set(currency.code, currency));
  }

  public commonCurrencyByCode(code: string): Currency {
    return this.commonCurrenciesByCode.get(code);
  }

  set categoryAliases(categoryAliases: Category[]) {
    this._categoryAliases = categoryAliases;
  }

  get categoryAliases(): Category[] {
    return this._categoryAliases;
  }
}

export const defaultCountriesSkillValue = '$default$';
export const defaultCountriesSkillDisplay = 'Default countries';

export interface CountryExpert {
  code: string;
  icon: {
    png: string;
  };
  name: string;
}

export const defaultCountryExpert = (): CountryExpert => {
  return {
    code: defaultCountriesSkillValue,
    icon: { png: '' },
    name: defaultCountriesSkillDisplay,
  };
};
