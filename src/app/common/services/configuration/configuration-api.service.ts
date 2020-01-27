import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ConnectableObservable, Observable, of } from 'rxjs';
import { map, publish, tap } from 'rxjs/operators';

import { BaseApi, ServerErrorResponse, ServerResponse } from '../../contracts/base-api';
import {
  Category,
  Conf,
  Configuration,
  Country,
  CountryExpert,
  Currency,
  P2DocumentType,
  P2VatRatesResponseBody,
  Province,
} from './configuration.model';

export interface ConfigurationResponse extends ServerResponse {
  config: Configuration;
}

interface DocTypes {
  docTypes: P2DocumentType[];
}

export interface P2DocumentTypeResponse extends ServerResponse {
  types: DocTypes;
}

export interface P2RatesResponse extends ServerResponse {
  rates: P2VatRatesResponseBody;
}

@Injectable()
export class ConfigurationAPIService extends BaseApi {
  public static VATBOX_SERVICE_NAME = 'configuration';
  public static API_BASE = `/api/${ConfigurationAPIService.VATBOX_SERVICE_NAME}/v1.0`;
  public static API_BASE_2 = `/api/${ConfigurationAPIService.VATBOX_SERVICE_NAME}/v2.0`;
  public static GET_CANADA_PROVINCES_API = `${
    ConfigurationAPIService.API_BASE_2
  }/countries/CA/provinces`;
  public static GET_CONFIGURATION_API = `${ConfigurationAPIService.API_BASE_2}`;
  public static GET_COUNTRIES_EXPERT_API = `${
    ConfigurationAPIService.API_BASE_2
  }/countries/expert?scope=vatrecovery`;
  public static GET_DOCUMENTS_TYPES_API = `${ConfigurationAPIService.API_BASE}/getDocumentTypes`;
  public static GET_VAT_RATES_API = `${ConfigurationAPIService.API_BASE}/getVatRates`;

  private static emptyConf: Conf = {
    countries: [],
    categories: [],
    currencies: [],
    commonCurrencies: [],
    allCountries: [],
    allCurrencies: [],
  };

  private configurationResponse: BehaviorSubject<ConfigurationResponse>;
  private hotObservableConfigurationResponse: ConnectableObservable<ConfigurationResponse>;

  private confSortedAlphabetically: BehaviorSubject<Conf> = new BehaviorSubject<Conf>(
    ConfigurationAPIService.emptyConf,
  );

  private cachedCountriesExpert: CountryExpert[];

  constructor(http: HttpClient) {
    super(http);
  }

  public static jsonResponseToConfigurationResponse(resJson: any): Configuration {
    const configuration: Configuration = new Configuration();
    configuration.countries = resJson.countries.filter(
      (country: Country) => country.supported === 'supported',
    );
    configuration.currencies = resJson.currencies.filter(
      (currency: Currency) => currency.supported === 'supported',
    );
    configuration.categories = resJson.categories.filter(
      (category: Category) => category.supported === 'SUPPORTED',
    );
    configuration.vatStrings = resJson.vatStrings;
    configuration.commonCurrencies = resJson.commonCurrencies;
    configuration.categoryAliases = resJson.categoryAliases;
    configuration.allCountries = resJson.countries;
    configuration.allCurrencies = resJson.currencies;

    return configuration;
  }

  public responseObserver(): Observable<ConfigurationResponse> {
    // if we already have configuration response -
    // return it as BehaviorSubject so Observers can subscribe to the subject to receive the last value
    if (this.configurationResponse != null) return this.configurationResponse;

    // if we have no pending request
    if (this.hotObservableConfigurationResponse == null) {
      // create the request and make it 'Hot' observable, means a shared single subscription that
      // the below subscribe() as well as additional outside subscribers will all be notified with
      this.hotObservableConfigurationResponse = this.getConfiguration().pipe(
        publish(),
      ) as ConnectableObservable<ConfigurationResponse>;

      // invoke connect() so we get notifications from this hot observable
      this.hotObservableConfigurationResponse.connect();

      // subscribe to this observable to update the value of this.configurationResponse when HTTP call returns
      this.hotObservableConfigurationResponse.subscribe(
        response => {
          this.configurationResponse = new BehaviorSubject<ConfigurationResponse>(response);
        },
        (error: ServerErrorResponse) => {
          console.error(`error: ${error.httpBodyText}`);
        },
      );
    }

    // return this 'Hot' observer
    return this.hotObservableConfigurationResponse;
  }

  public getConfiguration(): Observable<ConfigurationResponse> {
    return this.responseToServerResponse<ConfigurationResponse, ServerErrorResponse>(
      this.http.get(ConfigurationAPIService.GET_CONFIGURATION_API, { observe: 'response' }),
      (res, resJson) => {
        resJson.categories.map(c => {
          c.id = c.id.toString();
        });
        resJson.categoryAliases.map(c => {
          c.id = c.id.toString();
        });

        if (resJson == null) return;

        // convert the response json to Configuration class
        return { config: ConfigurationAPIService.jsonResponseToConfigurationResponse(resJson) };
      },
    );
  }

  public getCountries(): Observable<Country[]> {
    return this.http
      .get<Conf>(ConfigurationAPIService.GET_CONFIGURATION_API)
      .pipe(map(conf => conf.countries));
  }

  public getCountriesExpert(): Observable<CountryExpert[]> {
    if (this.cachedCountriesExpert) {
      return of(this.cachedCountriesExpert);
    }

    return this.http
      .get<CountryExpert[]>(ConfigurationAPIService.GET_COUNTRIES_EXPERT_API)
      .pipe(tap(countriesExpert => (this.cachedCountriesExpert = countriesExpert)));
  }

  public getCanadaProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(ConfigurationAPIService.GET_CANADA_PROVINCES_API);
  }

  /**
   * For P2 usage
   */
  public getDocumentsTypes(
    country: string,
    expenseType: string,
  ): Observable<P2DocumentTypeResponse> {
    return this.responseToServerResponse<P2DocumentTypeResponse, ServerErrorResponse>(
      this.http.get(
        `${
          ConfigurationAPIService.GET_DOCUMENTS_TYPES_API
        }?destCountry=${country}&expenseType=${encodeURIComponent(expenseType)}`,
        { observe: 'response' },
      ),
      (res, resJson: DocTypes) => {
        return {
          types: resJson && resJson.docTypes ? resJson : { docTypes: [] },
        };
      },
    );
  }

  public getVatRates(country: string): Observable<P2RatesResponse> {
    return this.responseToServerResponse<P2RatesResponse, ServerErrorResponse>(
      this.http.get(`${ConfigurationAPIService.GET_VAT_RATES_API}?destCountry=${country}`, {
        observe: 'response',
      }),
      (res, resJson) => {
        return {
          rates: resJson,
        };
      },
    );
  }

  // For workload and expedite usage

  /**
   * Gets the list of countries, categories and currencies from the configuration service,
   * sorts them alphabetically (by name) and returns an object of arrays
   */
  public getConfSortedAlphabetically(): BehaviorSubject<Conf> {
    // If the observable wasn't initiated yet and does not have a value
    if (
      JSON.stringify(this.confSortedAlphabetically.getValue()) ===
      JSON.stringify(ConfigurationAPIService.emptyConf)
    ) {
      // Get the configuration response from the conf api
      this.responseObserver().subscribe(
        response => {
          if (
            !response.config ||
            !response.config.countriesByCode ||
            !response.config.currenciesByCode ||
            !response.config.categoriesById
          ) {
            console.error('error in getConfSortedAlphabetically', 1);
          } else {
            const confLists: Conf = {
              // Convert the maps to sorted arrays
              countries: this.mapToSortedArray(response.config.countriesByCode),
              currencies: this.mapToSortedArray(response.config.currenciesByCode),
              categories: this.mapToSortedArray(response.config.categoriesById),
              commonCurrencies: this.mapToSortedArray(response.config.commonCurrenciesByCode),
              categoryAliases: response.config.categoryAliases,
              allCountries: this.mapToSortedArray(response.config.allCountriesByCode),
              allCurrencies: this.mapToSortedArray(response.config.allCurrenciesByCode),
            };

            // Return the list
            this.confSortedAlphabetically.next(confLists);
          }
        },
        (error: ServerErrorResponse) => {
          console.error('error in getConfSortedAlphabetically', 2, error.httpBodyText);
        },
      );
    }

    return this.confSortedAlphabetically;
  }

  /**
   * Converts the configuration Maps into arrays
   */
  private mapToSortedArray(mapObj: any): any[] {
    const retVal: any[] = [];
    mapObj.forEach(e => retVal.push(e));
    return retVal.sort(this.sortAlphabetically);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Sorts an array alphabetically by the object name
   */
  private sortAlphabetically(a: any, b: any): number {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 0;
  }
}
