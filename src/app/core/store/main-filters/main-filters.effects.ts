import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { isObject } from 'lodash-es';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, throttleTime, withLatestFrom } from 'rxjs/operators';

import { CompanyGroup } from '~/common/services/gate/models/rails-data.model';
import * as fromGateActions from '~/common/services/store/gate-rails/gate-rails.actions';
import { selectCompanyGroups } from '~/common/services/store/reducers';
import { AppState } from '~/common/store/reducers';
import { selectAccount, State } from '../reducers';
import { Account } from '~/common/services/account/account.model';
import * as fromActions from './main-filters.actions';

@Injectable()
export class MainFiltersEffects {
  @Effect()
  public setAccountId$: Observable<Action> = this.actions$.pipe(
    ofType<fromActions.SetAccount>(fromActions.MainFiltersActionTypes.SetAccount),
    mergeMap(() => [new fromActions.SetCompanyGroup()]),
  );

  @Effect()
  public setCompanyGroup$: Observable<Action> = this.actions$.pipe(
    ofType<fromActions.SetCompanyGroup>(fromActions.MainFiltersActionTypes.SetCompanyGroup),
    withLatestFrom(
      this.store.pipe(select(selectAccount)),
      this.store.pipe(select(selectCompanyGroups)),
      (action, account, companyGroups) => [account, companyGroups],
    ),
    map(([account, companyGroups]: [Account, CompanyGroup[]]) => {
      let name;
      const accountId = account.accountId;
      if (accountId
        && accountId > -1
        && companyGroups
        && companyGroups.length === 0) {
        name = account.accountName;
      } else {
        const companyGroupObj: CompanyGroup = companyGroups.find(
          (companyGroup: CompanyGroup) => companyGroup.id === accountId,
        );
        name = isObject(companyGroupObj) ? companyGroupObj.name : null;
      }

      return [accountId, name] as [number, string];
    }),
    filter(([id, name]) => Boolean(id && name)),
    throttleTime(500),
    mergeMap(([id, name]) => [
      new fromActions.UpdateMainFilters({
        company_group: {
          id,
          name,
          child_ids: [],
        },
      }),
    ]),
  );

  @Effect()
  public loadCompanyGroups$: Observable<Action> = this.actions$.pipe(
    ofType<fromGateActions.LoadCompanyGroupsByAccount>(
      fromGateActions.GateRailsActionTypes.LoadCompanyGroupsByAccount,
    ),
    mergeMap(() => [new fromActions.SetCompanyGroup()]),
  );

  constructor(private actions$: Actions, private store: Store<AppState & State>) {}
}
