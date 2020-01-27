import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MultiSelectOption } from '../../common/models/multy-select.model';
import { AppState } from '../../common/store/reducers';
import { Potential } from '../models/potential.model';
import { RefundEntity, RefundFlatNode, RefundNode } from '../models/refund.model';
import { DvrService } from '../services/dvr/dvr.service';
import { ResetAmountForm } from '../store/amount-form/amount-form.actions';
import * as fromAmountForm from '../store/amount-form/amount-form.reducer';
import * as fromCommentForm from '../store/comment-form/comment-form.reducer';
import { ResetDateRange } from '../store/date-range-form/date-range-form.actions';
import * as fromDateRangeForm from '../store/date-range-form/date-range-form.reducer';
import { SetActiveEntityId, SetCountries, SetSelectedFlatNodes } from '../store/dvr/dvr.actions';
import {
  selectActiveAccountId,
  selectActiveAccountName,
  selectActiveCountryCode,
  selectActiveEntityId,
  selectActiveEntityName,
  selectActiveIsUpdatedEntity,
  selectAmountFormState,
  selectCommentFormState,
  selectCountryFilter,
  selectCountryOptions,
  selectDateRangeFormState,
  selectRefundFilterFormState,
  selectRefundNodes,
  selectSelectedFlatNodes,
  State,
} from '../store/reducers';
import { SetCountryFilter } from '../store/refund-filter-form/refund-filter-form.actions';
import * as fromRefundFilterForm from '../store/refund-filter-form/refund-filter-form.reducer';

@Component({
  selector: 'app-dvr',
  templateUrl: './dvr.component.html',
  styleUrls: ['./dvr.component.scss'],
})
export class DvrComponent implements OnDestroy, OnInit {
  public accountName$: Observable<string>;
  public activeAccountId$: Observable<number>;
  public activeEntityId$: Observable<string>;
  public amountForm$: Observable<fromAmountForm.State>;
  public commentForm$: Observable<fromCommentForm.State>;
  public countryCode$: Observable<string>;
  public countryFilter$: Observable<string>;
  public countryOptions$: Observable<MultiSelectOption[]>;
  public dateRangeForm$: Observable<fromDateRangeForm.State>;
  public entityName$: Observable<string>;
  public isUpdatedEntity$: Observable<boolean>;
  public potentialForAccount$: Observable<Potential>;
  public potentialForEntity$: Observable<Potential>;
  public refundEntities$: Observable<RefundEntity[]>;
  public refundFilterForm$: Observable<fromRefundFilterForm.State>;
  public refundNodes$: Observable<RefundNode[]>;
  public selectedFlatNodes$: Observable<RefundFlatNode[]>;

  private componentDestroyed$ = new Subject();

  constructor(private dvrService: DvrService, private store: Store<AppState & State>) {}

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  public ngOnInit() {
    this.watchForAccountChanges();
    this.watchForRefunds();

    this.potentialForAccount$ = this.dvrService.potentialForAccount$;
    this.potentialForEntity$ = this.dvrService.potentialForEntity$;
    this.refundEntities$ = this.dvrService.entities$;

    this.accountName$ = this.store.pipe(select(selectActiveAccountName));
    this.activeAccountId$ = this.store.pipe(select(selectActiveAccountId));
    this.activeEntityId$ = this.store.pipe(select(selectActiveEntityId));
    this.amountForm$ = this.store.pipe(select(selectAmountFormState));
    this.commentForm$ = this.store.pipe(select(selectCommentFormState));
    this.countryCode$ = this.store.pipe(select(selectActiveCountryCode));
    this.countryFilter$ = this.store.pipe(select(selectCountryFilter));
    this.countryOptions$ = this.store.pipe(select(selectCountryOptions));
    this.dateRangeForm$ = this.store.pipe(select(selectDateRangeFormState));
    this.entityName$ = this.store.pipe(select(selectActiveEntityName));
    this.isUpdatedEntity$ = this.store.pipe(select(selectActiveIsUpdatedEntity));
    this.refundFilterForm$ = this.store.pipe(select(selectRefundFilterFormState));
    this.refundNodes$ = this.store.pipe(select(selectRefundNodes));
    this.selectedFlatNodes$ = this.store.pipe(select(selectSelectedFlatNodes));

    this.watchForCountryOptions();

    this.setCountriesRequest();
  }

  private watchForAccountChanges(): void {
    this.dvrService.accountChanges$.pipe(takeUntil(this.componentDestroyed$)).subscribe();
  }

  private watchForRefunds(): void {
    this.dvrService.refunds$.pipe(takeUntil(this.componentDestroyed$)).subscribe();
  }

  private watchForCountryOptions(): void {
    this.countryOptions$.pipe(takeUntil(this.componentDestroyed$)).subscribe();
  }

  private setCountriesRequest(): void {
    this.store.dispatch(new SetCountries());
  }

  public onCountryFilterChange(countryFilter: string): void {
    this.store.dispatch(new SetCountryFilter({ countryFilter }));
  }

  public onEntityIdSelect(activeEntityId: string): void {
    this.store.dispatch(new SetActiveEntityId({ activeEntityId }));
  }

  public onFilterReset(): void {
    combineLatest(this.store.pipe(select(selectActiveAccountId)), this.activeEntityId$)
      .subscribe(([accountId, entityId]: [number, string]) => {
        this.onResetAmount();
        this.onResetRange({ accountId, entityId });
      })
      .unsubscribe();
  }

  private onResetAmount(): void {
    this.store.dispatch(new ResetAmountForm());
  }

  private onResetRange({ accountId, entityId }: { accountId: number; entityId: string }): void {
    this.store.dispatch(new ResetDateRange({ accountId, entityId }));
  }

  public onSelectedFlatNodesChanges(selectedFlatNodes: RefundFlatNode[]): void {
    combineLatest(
      this.store.pipe(select(selectActiveAccountId)),
      this.countryCode$,
      this.activeEntityId$,
    )
      .subscribe(([accountId, countryCode, entityId]: [number, string, string]) => {
        this.store.dispatch(
          new SetSelectedFlatNodes({ accountId, countryCode, entityId, selectedFlatNodes }),
        );
      })
      .unsubscribe();
  }
}
