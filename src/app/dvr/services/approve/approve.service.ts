import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import {
  filter,
  map,
  share,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { selectUserEmail } from '../../../common/services/store/reducers';
import { AppState } from '../../../common/store/reducers';
import { Go } from '../../../common/store/router/router.actions';
import { muteFirst } from '../../../common/utils/utils';
import { DvrService } from '../dvr/dvr.service';
import { DvrApiService } from '../dvr-api/dvr-api.service';
import { ApproveHelper } from '../../helpers/approve.helper';
import { DvrHelper } from '../../helpers/dvr.helper';
import { Case, CasesFilter, CasesResponse } from '../../models/case.model';
import { Approve, Refund } from '../../models/dvr.model';
import * as fromActions from '../../store/approve/approve.actions';
import { CasesFilterFormValue } from '../../store/cases-filter-form/cases-filter-form.state';
import * as fromCasesActions from '../../store/cases/cases.actions';
import {
  DisableDateRange,
  FillDateRange,
  InitDateRanges,
} from '../../store/date-range-form/date-range-form.actions';
import {
  LoadAccount,
  LoadEntities,
  LoadRefunds,
  SetActiveAccountId,
  SetActiveEntityId,
  SetSelectedFlatNodes,
} from '../../store/dvr/dvr.actions';
import {
  selectActiveAccountId,
  selectApprove,
  selectApproveHash,
  selectCases,
  selectCasesFilter,
  State,
} from '../../store/reducers';

@Injectable()
export class ApproveService {
  public readonly requireApprove$: Observable<any> = this.store.pipe(
    select(selectApproveHash),
    filter(hash => Boolean(hash)),
    tap(() => this.store.dispatch(new fromActions.GetApprove())),
    switchMap(approveHash => this.api.getApprove(approveHash)),
    withLatestFrom(this.store.pipe(select(selectApproveHash))),
    tap(
      ([approve, approveHash]: [Approve, string]) => {
        this.store.dispatch(new fromActions.GetApproveSuccess());
        this.store.dispatch(new fromActions.LoadApprove({ approve, approveHash }));
        const {
          account: { name: accountName },
          end,
          entity: { id: entityId },
          start,
        } = approve;
        const accountId = parseInt(approve.account.id, 10);
        const entityIds = [entityId];
        this.store.dispatch(new InitDateRanges({ accountId, entityIds }));
        this.store.dispatch(new FillDateRange({ accountId, entityId, range: { end, start } }));
        this.store.dispatch(new DisableDateRange({ accountId, entityId }));
        this.store.dispatch(new LoadAccount({ account: { accountId, accountName } }));
        this.store.dispatch(new LoadEntities({ accountId, entities: [approve.entity] }));
        this.store.dispatch(new SetActiveAccountId({ activeAccountId: accountId }));
        this.store.dispatch(new SetActiveEntityId({ activeEntityId: entityId }));
        this.dispatchActionsForStatistics(approve);
      },
      error => this.store.dispatch(new fromActions.GetApproveFail(error)),
    ),
  );

  public readonly approve$: Observable<Approve> = muteFirst(
    this.requireApprove$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectApprove)),
  );

  public readonly doApprove$: Observable<any> = of(null).pipe(
    withLatestFrom(
      this.store.pipe(select(selectApproveHash)),
      this.store.pipe(select(selectUserEmail)),
    ),
    map(([, approveHash, userEmail]) => [approveHash, userEmail]),
    tap(() => this.store.dispatch(new fromActions.DoApprove())),
    switchMap(([approveHash, userEmail]) => this.api.doApprove(approveHash, userEmail)),
    withLatestFrom(this.store.pipe(select(selectApproveHash))),
    tap(
      ([approve, approveHash]: [Approve, string]) => {
        this.store.dispatch(new fromActions.DoApproveSuccess());
        this.store.dispatch(new fromActions.UpdateApprove({ approve, approveHash }));
        this.dvrService.getStatisticForAccount();
        this.dvrService.getStatisticForEntity();
      },
      error => this.store.dispatch(new fromActions.DoApproveFail(error)),
    ),
  );

  public readonly requireCases$: Observable<any> = combineLatest(
    this.store.pipe(select(selectActiveAccountId)),
    this.store.pipe(select(selectCasesFilter)),
  ).pipe(
    filter(([accountId]) => this.isValidAccountId(accountId)),
    tap(() => {
      this.store.dispatch(new fromCasesActions.ResetCasesState());
      this.store.dispatch(new fromCasesActions.GetCases());
    }),
    map(([accountId, formValue]: [number, CasesFilterFormValue]) => [
      accountId,
      DvrHelper.convertCasesFilterFormValue(formValue),
    ]),
    switchMap(([accountId, params]: [number, CasesFilter]) => this.api.getCases(accountId, params)),
    tap(
      ({ cases, statistics }: CasesResponse) => {
        this.store.dispatch(new fromCasesActions.GetCasesSuccess());
        this.store.dispatch(new fromCasesActions.LoadCases({ cases }));
        this.store.dispatch(new fromCasesActions.LoadStatistics({ statistics }));
      },
      error => this.store.dispatch(new fromCasesActions.GetCasesFail(error)),
    ),
  );

  public readonly cases$: Observable<Case[]> = muteFirst(
    this.requireCases$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectCases)),
  );

  constructor(
    private api: DvrApiService,
    private dvrService: DvrService,
    private store: Store<AppState & State>,
  ) {}

  private dispatchActionsForStatistics(approve: Approve): void {
    const {
      entity: { id: entityId },
    } = approve;
    const accountId = parseInt(approve.account.id, 10);
    const groupedRefunds = ApproveHelper.generateGroupedRefunds(approve.refunds);

    Object.entries(groupedRefunds).forEach(([countryCode, refunds]: [string, Refund[]]) => {
      const selectedFlatNodes = DvrHelper.generateFlatNodesFromRefunds(refunds);

      this.store.dispatch(new LoadRefunds({ accountId, countryCode, entityId, refunds }));
      this.store.dispatch(
        new SetSelectedFlatNodes({ accountId, countryCode, entityId, selectedFlatNodes }),
      );
    });
  }

  // noinspection JSMethodCanBeStatic
  private isValidAccountId(accountId: number): boolean {
    return accountId > 0;
  }

  public doApprove(): Subscription {
    return this.doApprove$.pipe(take(1)).subscribe();
  }

  public removeCase(): Observable<any> {
    return of(null).pipe(
      tap(() => this.store.dispatch(new fromCasesActions.RemoveCase())),
      withLatestFrom(
        this.store.pipe(select(selectActiveAccountId)),
        this.store.pipe(select(selectApproveHash)),
      ),
      switchMap(([, accountId, hash]: [any, number, string]) =>
        this.api.removeCase(accountId, hash),
      ),
      tap(
        () => {
          this.store.dispatch(new fromCasesActions.RemoveCaseSuccess());
          this.store.dispatch(new Go({ path: ['/tailored/cases'] }));
        },
        error => this.store.dispatch(new fromCasesActions.RemoveCaseFail(error)),
      ),
      take(1),
    );
  }
}
