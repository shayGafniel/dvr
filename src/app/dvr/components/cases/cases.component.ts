import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TimeFrame } from '../../../common/models/time-frame.model';
import { AppState } from '../../../common/store/reducers';
import { Case } from '../../models/case.model';
import {
  CasesListCounts,
  casesListCountsOrder,
  casesListCountsStatic,
} from '../../models/cases-list-counts.model';
import { ApproveStatus } from '../../models/dvr.model';
import { ApproveService } from '../../services/approve/approve.service';
import { DvrService } from '../../services/dvr/dvr.service';
import { MultiselectItem } from '../../../shared/models/multiselect.model';
import {
  FillEntities,
  FillStatus,
  FillTimeSelect,
  ResetCasesFilterForm,
} from '../../store/cases-filter-form/cases-filter-form.actions';
import * as fromCasesFilterFormState from '../../store/cases-filter-form/cases-filter-form.state';
import {
  selectCasesFilterFormState,
  selectCasesListCounts,
  selectMultiselectEntities,
  selectMultiselectSelectedEntities,
  selectSelectedTimeFrame,
  State,
} from '../../store/reducers';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss'],
})
export class CasesComponent implements OnDestroy, OnInit {
  public readonly casesListCountsOrder = casesListCountsOrder;
  public readonly casesListCountsStatic = casesListCountsStatic;

  public cases$: Observable<Case[]>;
  public casesFilterForm$: Observable<fromCasesFilterFormState.State>;
  public casesListCounts$: Observable<CasesListCounts>;
  public multiselectEntities$: Observable<MultiselectItem[]>;
  public multiselectSelectedEntities$: Observable<MultiselectItem[]>;
  public selectedTimeFrame$: Observable<TimeFrame>;

  private componentDestroyed$ = new Subject();

  constructor(
    private approveService: ApproveService,
    private dvrService: DvrService,
    private store: Store<AppState & State>,
  ) {}

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  public ngOnInit() {
    this.cases$ = this.approveService.cases$;

    this.casesFilterForm$ = this.store.pipe(select(selectCasesFilterFormState));
    this.casesListCounts$ = this.store.pipe(select(selectCasesListCounts));
    this.multiselectEntities$ = this.store.pipe(select(selectMultiselectEntities));
    this.multiselectSelectedEntities$ = this.store.pipe(select(selectMultiselectSelectedEntities));
    this.selectedTimeFrame$ = this.store.pipe(select(selectSelectedTimeFrame));

    this.watchForAccountChanges();
    this.watchForEntities();
  }

  private watchForAccountChanges(): void {
    this.dvrService.accountChanges$.pipe(takeUntil(this.componentDestroyed$)).subscribe();
  }

  private watchForEntities(): void {
    this.dvrService.entities$.pipe(takeUntil(this.componentDestroyed$)).subscribe();
  }

  public onFilterReset(): void {
    this.store.dispatch(new ResetCasesFilterForm());
  }

  public onFilterStatusChange(status: string): void {
    this.store.dispatch(new FillStatus({ status: status as ApproveStatus }));
  }

  public onSetEntities(entities: string[]) {
    this.store.dispatch(new FillEntities({ entities }));
  }

  public onTimeFrameSelect(timeFrame: TimeFrame): void {
    this.store.dispatch(new FillTimeSelect({ timeFrame }));
  }
}
