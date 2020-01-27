import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import * as statusTexts from 'builtin-status-codes';
import { of } from 'rxjs';

import {
  CONFIGURATION_RESPONSE_1,
  confSortedAlphabetically,
  countriesExpert,
  mock_documents_types,
  mock_vat_rates,
} from './configuration.mock';
import { CountryExpert } from './configuration.model';
import {
  ConfigurationAPIService,
  ConfigurationResponse,
  P2DocumentTypeResponse,
  P2RatesResponse,
} from './configuration-api.service';

describe('ConfigurationAPIService', () => {
  let apiService: ConfigurationAPIService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigurationAPIService],
    });
  }));

  beforeEach(() => {
    apiService = TestBed.get(ConfigurationAPIService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getConfiguration', () => {
    it('should work', () => {
      apiService.getConfiguration().subscribe(
        (configResponse: ConfigurationResponse) => {
          // expect the response
          expect(configResponse.httpStatus).toEqual(200);

          // expect the response data
          expect(configResponse.config.countryByCode('GB').name).toEqual('United Kingdom');
          expect(configResponse.config.currencyByCode('GBP').name).toEqual('British Pound');
          expect(configResponse.config.categoryById('4').name).toEqual('Car Rental');
        },
        error => {
          // we should not arrive to this error block
          console.warn(`error: ${error}`);
          expect(false).toBeTruthy();
        },
      );

      const request = httpMock.expectOne(ConfigurationAPIService.GET_CONFIGURATION_API);
      request.flush(CONFIGURATION_RESPONSE_1());
    });

    it('should fail with applicative http error status code', () => {
      apiService.getConfiguration().subscribe(
        () => expect(false).toBeTruthy(),
        error => {
          expect(error.httpStatus).toEqual(500);
        },
      );

      const request = httpMock.expectOne(ConfigurationAPIService.GET_CONFIGURATION_API);
      request.flush('', { status: 500, statusText: statusTexts[500] });
    });
  });

  // used by P2
  describe('getCountriesExpert', () => {
    it('should response successfully and have cached the response', () => {
      let countriesExpertResOne: CountryExpert[];
      let countriesExpertResTwo: CountryExpert[];

      apiService.getCountriesExpert().subscribe(
        (res: CountryExpert[]) => {
          countriesExpertResOne = res;
          expect(countriesExpertResOne).toBeTruthy();
        },
        () => expect(false).toBeTruthy(),
      );

      const request = httpMock.expectOne(ConfigurationAPIService.GET_COUNTRIES_EXPERT_API);
      request.flush(countriesExpert());

      apiService.getCountriesExpert().subscribe(
        (res: CountryExpert[]) => {
          countriesExpertResTwo = res;
          expect(countriesExpertResTwo).toBe(countriesExpertResOne);
        },
        () => expect(false).toBeTruthy(),
      );
    });
  });

  // used by P2
  describe('getDocumentsTypes', () => {
    it('should response successfully', () => {
      const country = 'IT';
      const expenseType = 'Hotel';

      apiService.getDocumentsTypes(country, expenseType).subscribe(
        (getDocTypesResponse: P2DocumentTypeResponse) => {
          expect(getDocTypesResponse.httpStatus).toEqual(200);
          // expect(getDocTypesResponse.types).toEqual(mock_documents_types()); // todo fix test
        },
        () => expect(false).toBeTruthy(),
      );

      const request = httpMock.expectOne(
        `${
          ConfigurationAPIService.GET_DOCUMENTS_TYPES_API
        }?destCountry=${country}&expenseType=${expenseType}`,
      );
      request.flush(mock_documents_types());
    });
  });

  describe('getVatRates', () => {
    it('should response successfully', () => {
      const country = 'IT';

      apiService.getVatRates(country).subscribe(
        (getRatesResponse: P2RatesResponse) => {
          // expect the response
          expect(getRatesResponse.httpStatus).toEqual(200);
          // expect(getRatesResponse.rates).toEqual({ rates: mock_vat_rates() }); // todo fix test
        },
        err => {
          expect(false).toBeTruthy();
        },
      );

      const request = httpMock.expectOne(
        `${ConfigurationAPIService.GET_VAT_RATES_API}?destCountry=${country}`,
      );
      request.flush({
        vatRates: mock_vat_rates(),
      });
    });
  });

  // Used by expedite and workload
  describe('getConfSortedAlphabetically', () => {
    it('should work', () => {
      const config = ConfigurationAPIService.jsonResponseToConfigurationResponse(
        CONFIGURATION_RESPONSE_1(),
      );
      spyOn(apiService, 'responseObserver').and.returnValue(
        of({
          ok: true,
          config: config,
        }),
      );

      apiService.getConfSortedAlphabetically().subscribe(conf => {
        if (typeof conf !== 'undefined') {
          // expect(conf).toEqual(confSortedAlphabetically()); // todo fix test
        }
      });
    });
  });
});
