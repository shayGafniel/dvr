import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { GateApiService } from '../../gate/gate-api.service';
import { UserCompany } from '../../gate/models/rails-data.model';
import { SecurityService } from '../../security/security.service';
import * as fromUserDataActions from './user-data.actions';

@Injectable()
export class UserDataEffects {
  @Effect()
  public getUserData = this.actions$.pipe(
    ofType<fromUserDataActions.GetUserData>(fromUserDataActions.UserActionTypes.GetUserData),
    mergeMap(() => {
      const userDetails = this.securityService.userDetails();
      return this.apiService.getUserTopLevelCompany().pipe(
        mergeMap((res: UserCompany) => {
          return [
            new fromUserDataActions.GetUserDataSuccess(),
            new fromUserDataActions.LoadUserData({ ...userDetails, company: res }),
          ];
        }),
        catchError(error => {
          return of(new fromUserDataActions.GetUserDataFail(error));
        }),
      );
    }),
  );

  public constructor(
    private actions$: Actions,
    private apiService: GateApiService,
    private securityService: SecurityService,
  ) {}
}
