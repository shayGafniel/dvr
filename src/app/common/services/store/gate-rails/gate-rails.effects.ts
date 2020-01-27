import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import { catchError, mergeMap } from 'rxjs/operators';
import { GateApiService } from '../../gate/gate-api.service';
import * as fromGateRailsActions from './gate-rails.actions';
import { Company } from '../../gate/models/rails-data.model';
import { FilteredGroupsResponse } from '../../../models/invoices-models/filters-data.model';
import { convertInvoicesOptionsResponse } from '../../../models/invoices-models/invoice.model';

@Injectable()
export class GateRailsEffects {
  @Effect()
  public getCompaniesByAccount = this.actions$.pipe(
    ofType<fromGateRailsActions.GetCompaniesByAccount>(
      fromGateRailsActions.GateRailsActionTypes.GetCompaniesByAccount,
    ),
    mergeMap((action) => {
        return this.apiService.getAllCompanies(action.payload).pipe(
          mergeMap((res: {'companies': Company[]}) => {
            return [
              new fromGateRailsActions.LoadCompaniesByAccount(res.companies),
              new fromGateRailsActions.GetCompaniesByAccountSuccess(),
            ];
          }),
          catchError(error => of(new fromGateRailsActions.GetCompaniesByAccountFail(error))),
        );
      },
    ),
  );

  @Effect()
  public getCompanyGroupsByAccount = this.actions$.pipe(
    ofType<fromGateRailsActions.GetCompanyGroupsByAccount>(
      fromGateRailsActions.GateRailsActionTypes.GetCompanyGroupsByAccount,
    ),
    mergeMap((action) => {
        return this.apiService.getAllCompanyGroups(action.payload).pipe(
          mergeMap((res: FilteredGroupsResponse) => {
            return [
              new fromGateRailsActions.LoadCompanyGroupsByAccount(res.companies),
              new fromGateRailsActions.GetCompanyGroupsByAccountSuccess(),
            ];
          }),
          catchError(error => of(new fromGateRailsActions.GetCompanyGroupsByAccountFail(error))),
        );
      },
    ),
  );

  @Effect()
  public getFilterOptionsFromRails = this.actions$.pipe(
    ofType<fromGateRailsActions.GetFilterOptions>(
      fromGateRailsActions.GateRailsActionTypes.GetFilterOptions,
    ),
    mergeMap((action) =>
      this.apiService.getInvoicesSelectorOptions(action.payload).pipe(
        mergeMap((res: any) => {
          return [
            new fromGateRailsActions.GetFilterOptionsSuccess(),
            new fromGateRailsActions.LoadFilterOptions(convertInvoicesOptionsResponse(res)),
          ];
        }),
        catchError(error => of(new fromGateRailsActions.GetFilterOptionsFail((error))))
      )
    ),
  );

  public constructor(
    private actions$: Actions,
    private apiService: GateApiService,
  ) {}
}
