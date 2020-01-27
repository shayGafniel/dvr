import { fakeAsync, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import * as fromAmountForm from './amount-form/amount-form.reducer';
import { configurationResponse } from '../../common/services/configuration/configuration.mock';
import { LoadConfigurationData } from '../../common/services/store/configuration/configuration.actions';
import * as fromConfiguration from '../../common/services/store/configuration/configuration.reducer';
import { DvrEffects } from './dvr.effects';
import * as fromDvrActions from './dvr/dvr.actions';
import * as fromDvr from './dvr/dvr.reducer';
import {
  account,
  accountId,
  countries,
  countryCode,
  countryCodeOption,
  countryCodeTwo,
  entities as defaultEntities,
} from './dvr/dvr.reducer.spec';
import { DvrHelper } from '../helpers/dvr.helper';
import { AccountEntity } from '../models/dvr.model';
import {
  FillCountry,
  ResetRefundFilterForm,
} from './refund-filter-form/refund-filter-form.actions';
import * as fromRefundFilterForm from './refund-filter-form/refund-filter-form.reducer';
import { hash } from '../services/dvr/dvr.service.spec';

describe('DvrEffects', () => {
  let actions$: Observable<any>;
  let effects: DvrEffects;
  let metadata: EffectsMetadata<DvrEffects>;
  let snackBar: MatSnackBar;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          dvr: combineReducers({
            amountForm: fromAmountForm.reducer,
            dvr: fromDvr.reducer,
            refundFilterForm: fromRefundFilterForm.reducer,
          }),
          core: combineReducers({
            configuration: fromConfiguration.reducer,
          }),
        }),
        MatSnackBarModule,
      ],
      providers: [DvrEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(DvrEffects);
    metadata = getEffectsMetadata(effects);
    snackBar = TestBed.get(MatSnackBar);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  function setActiveAccountId(): void {
    store.dispatch(new fromDvrActions.SetActiveAccountId({ activeAccountId: accountId }));
  }

  function setActiveEntityId(activeEntityId: string): void {
    store.dispatch(new fromDvrActions.SetActiveEntityId({ activeEntityId }));
  }

  function loadAccount(): void {
    store.dispatch(new fromDvrActions.LoadAccount({ account }));
  }

  function loadConfigurationData(conf = configurationResponse()): void {
    store.dispatch(new LoadConfigurationData(conf as any));
  }

  function loadEntities(entities: AccountEntity[]): void {
    store.dispatch(new fromDvrActions.LoadEntities({ accountId, entities }));
  }

  describe('loadConfigurationData$', () => {
    it('should return action to request countries setting on configuration loading', () => {
      const action = new LoadConfigurationData(configurationResponse() as any);
      const completion = [new fromDvrActions.SetCountries()];

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion[0] });

      expect(effects.loadConfigurationData$).toBeObservable(expected);
    });
  });

  describe('setCountries$', () => {
    const countriesFiltered = DvrHelper.countriesToSimplifiedCountries(
      DvrHelper.filterSupportedCountries(countries),
    );

    beforeEach(() => {
      loadConfigurationData();
    });

    it('should return action to set simplified countries', () => {
      const action = new fromDvrActions.SetCountries();
      const completion = [new fromDvrActions.LoadCountries({ countries: countriesFiltered })];

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion[0] });

      expect(effects.setCountries$).toBeObservable(expected);
    });

    it('should filter if no configuration', () => {
      loadConfigurationData({ countries: [] } as any);

      const action = new fromDvrActions.SetCountries();

      actions$ = hot('-a', { a: action });
      const expected = cold('-');

      expect(effects.setCountries$).toBeObservable(expected);
    });
  });

  describe('resetOnActiveEntityId$', () => {
    it('should return action to reset refundFilter form', () => {
      const action = new fromDvrActions.SetActiveEntityId({ activeEntityId: '1' });
      const completion = [new ResetRefundFilterForm()];

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion[0] });

      expect(effects.resetOnActiveEntityId$).toBeObservable(expected);
    });
  });

  describe('resetOnResetActiveEntityId$', () => {
    it('should return action to reset refundFilter form', () => {
      const action = new fromDvrActions.ResetActiveEntityId();
      const completion = [new ResetRefundFilterForm()];

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion[0] });

      expect(effects.resetOnResetActiveEntityId$).toBeObservable(expected);
    });
  });

  describe('setSingleCountryOnActiveEntityId$', () => {
    const activeEntityId = defaultEntities[0].id;

    const singleCountryEntity: AccountEntity = { ...defaultEntities[0], countries: [countryCode] };
    const notSingleCountryEntity: AccountEntity = {
      ...defaultEntities[0],
      countries: [countryCode, countryCodeTwo],
    };

    beforeEach(() => {
      setActiveAccountId();
      setActiveEntityId(activeEntityId);
      loadAccount();
      loadEntities([singleCountryEntity]);
    });

    it('should return action to set country if entity has 1 country', () => {
      const action = new fromDvrActions.SetActiveEntityId({ activeEntityId });
      const completion = [new FillCountry({ country: countryCodeOption })];

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion[0] });

      expect(effects.setSingleCountryOnActiveEntityId$).toBeObservable(expected);
    });

    it('should filter if entity has 2 countries and more', () => {
      loadEntities([notSingleCountryEntity]);

      const action = new fromDvrActions.SetActiveEntityId({ activeEntityId });

      actions$ = hot('-a', { a: action });
      const expected = cold('-');

      expect(effects.setSingleCountryOnActiveEntityId$).toBeObservable(expected);
    });
  });

  describe('showCreateDraftSuccessMessage$', () => {
    const action = new fromDvrActions.CreateDraftSuccess(hash);

    it('should be registered so that it does not dispatch an action', () => {
      expect(metadata.showCreateDraftSuccessMessage$).toEqual({ dispatch: false });
    });

    it('should call open method', fakeAsync(() => {
      const spyOpen = spyOn(snackBar, 'open').and.returnValue({ onAction: () => of() });
      actions$ = hot('-a-', { a: action });
      expect(effects.showCreateDraftSuccessMessage$).toBeObservable(actions$);
      expect(spyOpen.calls.first().args[0]).toBeTruthy();
    }));
  });
});
