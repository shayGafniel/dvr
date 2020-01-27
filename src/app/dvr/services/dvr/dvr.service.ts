import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { isEmpty, isEqual, keys } from 'lodash-es';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  share,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Account } from '../../../common/services/account/account.model';
import { ConfigurationAPIService } from '../../../common/services/configuration/configuration-api.service';
import { AppState } from '../../../common/store/reducers';
import { muteFirst } from '../../../common/utils/utils';
import { selectAccount } from '../../../core/store/reducers';
import { DvrApiService } from '../dvr-api/dvr-api.service';
import { DvrHelper } from '../../helpers/dvr.helper';
import {
  AccountEntity,
  CreateDraftResponse,
  Draft,
  DvrStatistics,
  IsDisabledEntities,
  IsUpdatedEntities,
  Refund,
} from '../../models/dvr.model';
import { Potential } from '../../models/potential.model';
import { RefundEntity } from '../../models/refund.model';
import { FromTo } from '../../store/amount-form/amount-form.state';
import { InitComments } from '../../store/comment-form/comment-form.actions';
import {
  DisableDateRange,
  EnableDateRange,
  InitDateRanges,
} from '../../store/date-range-form/date-range-form.actions';
import * as fromDvrActions from '../../store/dvr/dvr.actions';
import {
  selectActiveAccountId,
  selectActiveAccountStatistics,
  selectActiveCountryCode,
  selectActiveEntityId,
  selectAmountFromTo,
  selectDraft,
  selectEnd,
  selectEntities,
  selectIsDisabledEntities,
  selectIsUpdatedEntities,
  selectPotentialForAccount,
  selectPotentialForEntity,
  selectRefunds,
  selectStart,
  State,
} from '../../store/reducers';
import { GateApiService } from '../../../common/services/gate/gate-api.service';
import { TaxTailorEntitiesParams } from '../../../common/services/gate/models/rails-data.model';

@Injectable()
export class DvrService {
  public static amountDebounce = 500;

  public readonly accountChanges$: Observable<any> = this.store.pipe(
    select(selectAccount),
    filter((account: Account) => this.isValidAccountId(account.accountId)),
    tap((account: Account) => {
      this.store.dispatch(new fromDvrActions.ResetActiveEntityId());
      this.store.dispatch(new fromDvrActions.LoadAccount({ account }));
      this.store.dispatch(
        new fromDvrActions.SetActiveAccountId({ activeAccountId: account.accountId }),
      );
    }),
  );

  public readonly requireAccountStatistics$: Observable<any> = this.store.pipe(
    select(selectActiveAccountId),
    withLatestFrom(this.store.pipe(select(selectActiveAccountStatistics))),
    filter(([accountId, statistics]) => this.isValidAccountId(accountId) && isEmpty(statistics)),
    tap(() => this.store.dispatch(new fromDvrActions.GetAccountStatistics())),
    switchMap(([accountId]) => this.api.getAccountStatistics(accountId)),
    withLatestFrom(this.store.pipe(select(selectActiveAccountId))),
    tap(
      ([statistics, accountId]: [DvrStatistics, number]) => {
        this.store.dispatch(new fromDvrActions.GetAccountStatisticsSuccess());
        this.store.dispatch(new fromDvrActions.LoadAccountStatistics({ accountId, statistics }));
      },
      error => this.store.dispatch(new fromDvrActions.GetAccountStatisticsFail(error)),
    ),
  );

  public readonly potentialForAccount$: Observable<Potential> = muteFirst(
    this.requireAccountStatistics$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectPotentialForAccount)),
  );

  public readonly createDraft$: Observable<any> = of(null).pipe(
    withLatestFrom(this.store.pipe(select(selectDraft))),
    map(([, draft]) => draft),
    filter((draft: Draft) => DvrHelper.isFilledDraft(draft)),
    tap(() => this.store.dispatch(new fromDvrActions.CreateDraft())),
    switchMap((draft: Draft) => this.api.createDraft(draft)),
    withLatestFrom(
      this.store.pipe(select(selectActiveAccountId)),
      this.store.pipe(select(selectActiveEntityId)),
    ),
    tap(
      ([hash, accountId, entityId]: [CreateDraftResponse, number, string]) => {
        this.store.dispatch(new fromDvrActions.CreateDraftSuccess(hash));
        this.store.dispatch(
          new fromDvrActions.ResetSelectedFlatNodesOfEntity({ accountId, entityId }),
        );
      },
      error => this.store.dispatch(new fromDvrActions.CreateDraftFail(error)),
    ),
  );

  public readonly dateRangeDisabling$: Observable<any> = this.store.pipe(
    select(selectIsUpdatedEntities),
    withLatestFrom(
      this.store.pipe(select(selectIsDisabledEntities)),
      this.store.pipe(select(selectActiveAccountId)),
    ),
    filter(
      ([isUpdatedEntities, isDisabledEntities]: [IsUpdatedEntities, IsDisabledEntities, number]) =>
        !isEmpty(isUpdatedEntities) &&
        !isEmpty(isDisabledEntities) &&
        isEqual(keys(isUpdatedEntities), keys(isDisabledEntities)),
    ),
    tap(
      ([isUpdatedEntities, isDisabledEntities, accountId]: [
        IsUpdatedEntities,
        IsDisabledEntities,
        number
      ]) => {
        Object.entries(isUpdatedEntities).forEach(([entityId, isUpdatedEntity]) => {
          if (isUpdatedEntity !== isDisabledEntities[entityId]) {
            this.store.dispatch(
              isUpdatedEntity
                ? new DisableDateRange({ accountId, entityId })
                : new EnableDateRange({ accountId, entityId }),
            );
          }
        });
      },
    ),
  );

  public readonly requireEntities$: Observable<any> = this.store.pipe(
    select(selectActiveAccountId),
    withLatestFrom(this.store.pipe(select(selectEntities))),
    filter(([accountId, entities]) => this.isValidAccountId(accountId) && isEmpty(entities)),
    tap(() => this.store.dispatch(new fromDvrActions.GetEntities())),
    switchMap(([accountId]) => {
      const taxTailorEntitiesParams: TaxTailorEntitiesParams = { account_id: accountId.toString() };
      return this.gateApiService.getTaxTailorEntities(taxTailorEntitiesParams);
    }),
    withLatestFrom(this.store.pipe(select(selectActiveAccountId))),
    tap(
      ([entities, accountId]: [AccountEntity[], number]) => {
        this.store.dispatch(new fromDvrActions.GetEntitiesSuccess());
        this.store.dispatch(new fromDvrActions.LoadEntities({ accountId, entities }));
        const entityIds = entities.map(entity => entity.id);
        this.store.dispatch(new InitDateRanges({ accountId, entityIds }));
      },
      error => this.store.dispatch(new fromDvrActions.GetEntitiesFail(error)),
    ),
  );

  public readonly entities$: Observable<RefundEntity[]> = muteFirst(
    this.requireEntities$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectEntities)),
  );

  public readonly requireEntityStatistics$: Observable<any> = combineLatest(
    this.store.pipe(select(selectActiveAccountId)),
    this.store.pipe(select(selectActiveEntityId)),
    this.store.pipe(select(selectEnd)),
    this.store.pipe(select(selectStart)),
  ).pipe(
    debounceTime(0),
    filter(([accountId, entityId]) => this.isValidAccountId(accountId) && Boolean(entityId)),
    tap(() => this.store.dispatch(new fromDvrActions.GetEntityStatistics())),
    switchMap(([accountId, entityId, end, start]: [number, ...string[]]) =>
      this.api.getEntityStatistics(accountId, entityId, { start, end }),
    ),
    withLatestFrom(
      this.store.pipe(select(selectActiveAccountId)),
      this.store.pipe(select(selectActiveEntityId)),
    ),
    tap(
      ([statistics, accountId, entityId]: [DvrStatistics, number, string]) => {
        this.store.dispatch(new fromDvrActions.GetEntityStatisticsSuccess());
        this.store.dispatch(
          new fromDvrActions.LoadEntityStatistics({ accountId, entityId, statistics }),
        );
      },
      error => this.store.dispatch(new fromDvrActions.GetEntityStatisticsFail(error)),
    ),
  );

  public readonly potentialForEntity$: Observable<Potential> = muteFirst(
    this.requireEntityStatistics$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectPotentialForEntity)),
  );

  public readonly requireRefunds$: Observable<any> = combineLatest(
    this.store.pipe(select(selectActiveCountryCode)),
    this.store.pipe(select(selectEnd)),
    this.store.pipe(select(selectStart)),
    this.store.pipe(select(selectAmountFromTo)).pipe(debounceTime(DvrService.amountDebounce)),
  ).pipe(
    debounceTime(0),
    filter(([country]: [string, string, string, FromTo]) => Boolean(country)),
    withLatestFrom(
      this.store.pipe(select(selectActiveAccountId)),
      this.store.pipe(select(selectActiveEntityId)),
    ),
    tap(() => this.store.dispatch(new fromDvrActions.GetRefunds())),
    switchMap(
      ([[country, end, start, { from: amountFrom, to: amountTo }], accountId, entityId]: [
        [string, string, string, FromTo],
        number,
        string
      ]) =>
        this.api.getRefunds({
          accountId,
          entityId,
          params: { amountFrom, amountTo, country, start, end },
        }),
    ),
    withLatestFrom(
      this.store.pipe(select(selectActiveAccountId)),
      this.store.pipe(select(selectActiveCountryCode)),
      this.store.pipe(select(selectActiveEntityId)),
    ),
    tap(
      ([refunds, accountId, countryCode, entityId]: [Refund[], number, string, string]) => {
        this.store.dispatch(new fromDvrActions.GetRefundsSuccess());
        this.store.dispatch(
          new fromDvrActions.LoadRefunds({ accountId, countryCode, entityId, refunds }),
        );
        const refundComments = DvrHelper.generateRefundCommentsFromRefunds(refunds);
        this.store.dispatch(new InitComments({ accountId, entityId, refundComments }));
      },
      error => this.store.dispatch(new fromDvrActions.GetRefundsFail(error)),
    ),
  );

  public readonly refunds$: Observable<Refund[]> = muteFirst(
    this.requireRefunds$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(selectRefunds)),
  );

  public readonly subscriptions: Subscription[] = [];

  constructor(
    private api: DvrApiService,
    private configurationService: ConfigurationAPIService,
    private gateApiService: GateApiService,
    private store: Store<AppState & State>,
  ) {
    this.subscriptions.push(this.dateRangeDisabling$.subscribe());
  }

  // noinspection JSMethodCanBeStatic
  private isValidAccountId(accountId: number): boolean {
    return accountId > 0;
  }

  public createDraft(): Subscription {
    return this.createDraft$.pipe(take(1)).subscribe();
  }

  public getStatisticForAccount(): Subscription {
    return this.requireAccountStatistics$.pipe(take(1)).subscribe();
  }

  public getStatisticForEntity(): Subscription {
    return this.requireEntityStatistics$.pipe(take(1)).subscribe();
  }
}
