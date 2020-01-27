import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { ConfigurationAPIService } from '../../configuration/configuration-api.service';
import { Conf } from '../../configuration/configuration.model';
import * as fromConfigurationActions from './configuration.actions';

@Injectable()
export class ConfigurationEffects {
  @Effect()
  public getConfigurationData = this.actions$.pipe(
    ofType<fromConfigurationActions.GetConfigurationData>(
      fromConfigurationActions.ConfigurationActionTypes.GetConfigurationData,
    ),
    mergeMap(() => {
        return this.apiService.getConfSortedAlphabetically().pipe(
          mergeMap((res: Conf) => {
            return [
              new fromConfigurationActions.GetConfigurationDataSuccess(),
              new fromConfigurationActions.LoadConfigurationData(res),
            ];
          }),
          catchError(error => {
            return of(new fromConfigurationActions.GetConfigurationDataFail(error));
          }),
        );
      }
    ),
  );

  public constructor(private actions$: Actions, private apiService: ConfigurationAPIService) {}
}
