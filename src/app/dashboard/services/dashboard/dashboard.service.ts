import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { combineLatest, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { AppState } from '~/common/store/reducers';
import { muteFirst } from '~/common/utils/utils';
import {selectAccountId, selectPreparedMainFilters} from '~/core/store/reducers';
import { DashboardApiService } from '../dashboard-api/dashboard-api.service';
import { DashboardUtil } from '../../dashboard.util';
import { Dashboard } from '../../models/dashboard.model';
import { DashboardGraphs, DashboardGraphsResponse } from '../../models/dashboard-graphs.model';
import { DashboardPromotions } from '../../models/dashboard-promotions.model';
import { DashboardTopRow } from '../../models/dashboard-top-row.model';
import { MainFilters } from '~/shared/models/main-filters.model';
import * as fromActions from '../../store/dashboard/dashboard.actions';
import {
  selectDashboard,
  selectDashboardGraphs,
  selectDashboardPromotions,
  selectDashboardTopRow,
  State,
} from '../../store/reducers';
import { selectCompanies } from '~/common/services/store/reducers';
import { Company } from '~/common/services/gate/models/rails-data.model';

@Injectable()
export class DashboardService {
  public readonly requireDashboard$: Observable<any> = this.store.pipe(
    withLatestFrom(
      this.store.pipe(select(selectAccountId)),
      this.store.pipe(select(selectPreparedMainFilters)),
      (state, accountId: number, mainFilters: MainFilters) =>
        ({ accountId: accountId, mainFilters: mainFilters }),
    ),
    map(({accountId, mainFilters}) => DashboardUtil.generateDashboardFilters(accountId, mainFilters)),
    distinctUntilChanged(isEqual),
    filter(DashboardUtil.isFilledDashboardFilters),
    tap(() => this.store.dispatch(new fromActions.GetDashboard())),
    switchMap(dashboardFilters => this.api.getDashboard(dashboardFilters)),
    tap(
      (dashboard: Dashboard) => {
        this.store.dispatch(new fromActions.GetDashboardSuccess());
        this.store.dispatch(new fromActions.LoadDashboard({ dashboard }));
      },
      error => this.store.dispatch(new fromActions.GetDashboardFail(error)),
    ),
  );

  public readonly dashboard$: Observable<Dashboard> = muteFirst(
    this.requireDashboard$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectDashboard)),
  );

  public readonly requireDashboardGraphs$: Observable<any> = this.store.pipe(
    withLatestFrom(
      this.store.pipe(select(selectAccountId)),
      this.store.pipe(select(selectPreparedMainFilters)),
      this.store.pipe(select(selectCompanies)),
      (state, accountId: number, mainFilters: MainFilters, allCompanies: Company[]) =>
        ({ accountId: accountId, mainFilters: mainFilters, allCompanies: allCompanies }),
    ),
    map(({ accountId, mainFilters, allCompanies }) =>
      DashboardUtil.generateDashboardGraphsFilters(accountId, mainFilters, allCompanies)),
    distinctUntilChanged(isEqual),
    filter(DashboardUtil.isFilledDashboardGraphsFilters),
    filter(DashboardUtil.isFilledDashboardEntities),
    tap(() => this.store.dispatch(new fromActions.GetDashboardGraphs())),
    switchMap(dashboardGraphsFilters => this.api.getDashboardGraphs(dashboardGraphsFilters)),
    tap(
      (dashboardGraphs: DashboardGraphsResponse) => {
        this.store.dispatch(new fromActions.GetDashboardGraphsSuccess());
        this.store.dispatch(new fromActions.LoadDashboardGraphs({ dashboardGraphs }));
      },
      error => this.store.dispatch(new fromActions.GetDashboardGraphsFail(error)),
    ),
  );

  public readonly dashboardGraphs$: Observable<DashboardGraphs> = muteFirst(
    this.requireDashboardGraphs$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectDashboardGraphs)),
  );

  public readonly requireDashboardTopRow$: Observable<DashboardTopRow> = this.store.pipe(
    withLatestFrom(
      this.store.pipe(select(selectAccountId)),
      this.store.pipe(select(selectPreparedMainFilters)),
      (state, accountId: number, mainFilters: MainFilters) =>
        ({ accountId: accountId, mainFilters: mainFilters }),
    ),
    map(( {accountId, mainFilters}) => DashboardUtil.generatePromotionFilters(accountId, mainFilters)),
    distinctUntilChanged(isEqual),
    filter(DashboardUtil.isFilledPromotionFilter),
    tap(() => this.store.dispatch(new fromActions.GetDashboardTopRow())),
    switchMap(params => this.api.getDashboardTopRow(params)),
    tap(
      (dashboardTopRow: DashboardTopRow) => {
        this.store.dispatch(new fromActions.GetDashboardTopRowSuccess());
        this.store.dispatch(new fromActions.LoadDashboardTopRow({ dashboardTopRow }));
      },
      error => this.store.dispatch(new fromActions.GetDashboardTopRowFail(error)),
    ),
  );

  public readonly requireDashboardPromotions$: Observable<DashboardPromotions> = this.store.pipe(
    withLatestFrom(
      this.store.pipe(select(selectAccountId)),
      this.store.pipe(select(selectPreparedMainFilters)),
      (state, accountId: number, mainFilters: MainFilters) =>
        ({ accountId: accountId, mainFilters: mainFilters }),
    ),
    map(( {accountId, mainFilters}) => DashboardUtil.generatePromotionFilters(accountId, mainFilters)),
    distinctUntilChanged(isEqual),
    filter(DashboardUtil.isFilledPromotionFilter),
    tap(() => this.store.dispatch(new fromActions.GetDashboardPromotions())),
    switchMap(params => this.api.getDashboardPromotions( params )),
    tap(
      (dashboardPromotions: DashboardPromotions) => {
        this.store.dispatch(new fromActions.GetDashboardPromotionsSuccess());
        this.store.dispatch(new fromActions.LoadDashboardPromotions({ dashboardPromotions }));
      },
      error => this.store.dispatch(new fromActions.GetDashboardPromotionsFail(error)),
    ),
  );

  public readonly dashboardTopRow$: Observable<DashboardTopRow> = muteFirst(
    this.requireDashboardTopRow$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectDashboardTopRow)),
  );

  public readonly dashboardPromotions$: Observable<DashboardPromotions> = muteFirst(
    this.requireDashboardPromotions$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectDashboardPromotions)),
  );

  constructor(private api: DashboardApiService, private store: Store<AppState & State>) {}
}
