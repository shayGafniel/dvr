import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { MultiSelectOption } from '../../common/models/multy-select.model';
import { Conf, Country } from '../../common/services/configuration/configuration.model';
import {
  ConfigurationActionTypes,
  LoadConfigurationData,
} from '../../common/services/store/configuration/configuration.actions';
import { selectConfiguration } from '../../common/services/store/reducers';
import { AppState } from '../../common/store/reducers';
import { Go } from '../../common/store/router/router.actions';
import * as fromDvrActions from './dvr/dvr.actions';
import { DvrHelper } from '../helpers/dvr.helper';
import { selectCountryOptions, State } from './reducers';
import {
  FillCountry,
  ResetRefundFilterForm,
} from './refund-filter-form/refund-filter-form.actions';

@Injectable()
export class DvrEffects {
  @Effect()
  public loadConfigurationData$: Observable<Action> = this.actions$.pipe(
    ofType<LoadConfigurationData>(ConfigurationActionTypes.LoadConfigurationData),
    mergeMap(() => [new fromDvrActions.SetCountries()]),
  );

  @Effect()
  public resetOnActiveEntityId$: Observable<Action> = this.actions$.pipe(
    ofType<fromDvrActions.SetActiveEntityId>(fromDvrActions.DvrActionTypes.SetActiveEntityId),
    mergeMap(() => [new ResetRefundFilterForm()]),
  );

  @Effect()
  public resetOnResetActiveEntityId$: Observable<Action> = this.actions$.pipe(
    ofType<fromDvrActions.ResetActiveEntityId>(fromDvrActions.DvrActionTypes.ResetActiveEntityId),
    mergeMap(() => [new ResetRefundFilterForm()]),
  );

  @Effect()
  public setCountries$: Observable<Action> = this.actions$.pipe(
    ofType<fromDvrActions.SetCountries>(fromDvrActions.DvrActionTypes.SetCountries),
    withLatestFrom(
      this.store.pipe(select(selectConfiguration)),
      (action, conf: Conf) => conf.countries,
    ),
    filter((countries: Country[]) => countries.length > 0),
    map((countries: Country[]) => DvrHelper.filterSupportedCountries(countries)),
    map((countries: Country[]) => DvrHelper.countriesToSimplifiedCountries(countries)),
    mergeMap((countries: Country[]) => [new fromDvrActions.LoadCountries({ countries })]),
  );

  @Effect()
  public setSingleCountryOnActiveEntityId$: Observable<Action> = this.actions$.pipe(
    ofType<fromDvrActions.SetActiveEntityId>(fromDvrActions.DvrActionTypes.SetActiveEntityId),
    withLatestFrom(
      this.store.pipe(select(selectCountryOptions)),
      (action, countryOptions) => countryOptions,
    ),
    filter(countryOptions => countryOptions.length === 1),
    mergeMap((countryOptions: MultiSelectOption[]) => [
      new FillCountry({ country: countryOptions[0] }),
    ]),
  );

  @Effect({ dispatch: false })
  public showCreateDraftSuccessMessage$: Observable<Action> = this.actions$.pipe(
    ofType<fromDvrActions.CreateDraftSuccess>(fromDvrActions.DvrActionTypes.CreateDraftSuccess),
    tap(() => this.showCreateDraftSuccessMessage()),
  );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private store: Store<AppState & State>,
  ) {}

  private showCreateDraftSuccessMessage(): void {
    const snackBarRef = this.snackBar.open('Draft created successfully', 'Go to cases', {
      duration: 10000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.store.dispatch(new Go({ path: ['/tailored/cases'] }));
    });
  }
}
