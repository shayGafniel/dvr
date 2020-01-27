import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { skip, take, takeUntil, tap } from 'rxjs/operators';

import { MultiSelectOption } from '../../../common/models/multy-select.model';
import { AppState } from '../../../common/store/reducers';
import { selectAccount, selectAccountId } from '../../../core/store/reducers';
import { Potential } from '../../models/potential.model';
import { GroupedRefundNodes, RefundEntity } from '../../models/refund.model';
import { DvrService } from '../../services/dvr/dvr.service';
import * as fromCommentForm from '../../store/comment-form/comment-form.reducer';
import * as fromDateRangeForm from '../../store/date-range-form/date-range-form.reducer';
import { SetActiveEntityId } from '../../store/dvr/dvr.actions';
import {
  selectActiveAccountName,
  selectActiveEntityId,
  selectActiveEntityName,
  selectCommentFormState,
  selectCountryOptions,
  selectDateRangeFormState,
  selectIsEmptyDvr,
  selectSelectedGroupedRefundNodes,
  selectTouchedEntities,
  State,
} from '../../store/reducers';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnDestroy, OnInit {
  public accountName$: Observable<string>;
  public activeAccountId$: Observable<number>;
  public activeEntityId$: Observable<string>;
  public commentForm$: Observable<fromCommentForm.State>;
  public countryOptions$: Observable<MultiSelectOption[]>;
  public dateRangeForm$: Observable<fromDateRangeForm.State>;
  public entityName$: Observable<string>;
  public groupedRefundNodes$: Observable<GroupedRefundNodes>;
  public isDraftCreating = false;
  public potentialForAccount$: Observable<Potential>;
  public potentialForEntity$: Observable<Potential>;
  public refundEntities$: Observable<RefundEntity[]>;

  private componentDestroyed$ = new Subject();

  constructor(
    private dvrService: DvrService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState & State>,
  ) {}

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  public ngOnInit() {
    this.redirectOnDirectLoad();
    this.watchForAccountChanges();

    this.potentialForAccount$ = this.dvrService.potentialForAccount$;
    this.potentialForEntity$ = this.dvrService.potentialForEntity$;

    this.accountName$ = this.store.pipe(select(selectActiveAccountName));
    this.activeAccountId$ = this.store.pipe(select(selectAccountId));
    this.activeEntityId$ = this.store.pipe(select(selectActiveEntityId));
    this.commentForm$ = this.store.pipe(select(selectCommentFormState));
    this.countryOptions$ = this.store.pipe(select(selectCountryOptions));
    this.dateRangeForm$ = this.store.pipe(select(selectDateRangeFormState));
    this.entityName$ = this.store.pipe(select(selectActiveEntityName));
    this.groupedRefundNodes$ = this.store.pipe(select(selectSelectedGroupedRefundNodes));
    this.refundEntities$ = this.store.pipe(select(selectTouchedEntities));
  }

  private redirectOnDirectLoad(): void {
    this.store
      .pipe(select(selectIsEmptyDvr))
      .pipe(
        take(1),
        tap(isEmptyDvr => {
          if (isEmptyDvr) {
            this.redirectBack();
          }
        }),
      )
      .subscribe();
  }

  private redirectBack(): Promise<any> {
    return this.router.navigate(['../'], { relativeTo: this.route });
  }

  private watchForAccountChanges(): void {
    this.store
      .pipe(
        select(selectAccount),
        skip(1),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe(() => {
        this.redirectBack();
      });
  }

  public createDraft(): void {
    this.isDraftCreating = true;

    this.dvrService.createDraft().add(() => {
      this.isDraftCreating = false;
      this.redirectIfEmpty();
    });
  }

  private redirectIfEmpty(): void {
    this.refundEntities$.pipe(take(1)).subscribe(entities => {
      if (entities.length === 0) {
        this.redirectBack();
      } else {
        this.store.dispatch(new SetActiveEntityId({ activeEntityId: entities[0].id }));
      }
    });
  }

  public onEntityIdSelect(activeEntityId: string): void {
    this.store.dispatch(new SetActiveEntityId({ activeEntityId }));
  }
}
