import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DialogStyleClass } from '../../../common/components/common-dialog/common.dialog-model';
import { ConfirmDialogComponent } from '../../../common/components/common-dialog/types/confirm-dialog.component';
import { MultiSelectOption } from '../../../common/models/multy-select.model';
import { selectIsAdmin } from '../../../common/services/store/reducers';
import { AppState } from '../../../common/store/reducers';
import { ApproveStatus } from '../../models/dvr.model';
import { Potential } from '../../models/potential.model';
import { GroupedRefundNodes, RefundEntity } from '../../models/refund.model';
import { ApproveService } from '../../services/approve/approve.service';
import { DvrService } from '../../services/dvr/dvr.service';
import { SetApproveHash } from '../../store/approve/approve.actions';
import * as fromDateRangeForm from '../../store/date-range-form/date-range-form.reducer';
import { ResetDvr, SetCountries } from '../../store/dvr/dvr.actions';
import {
  selectActiveAccountId,
  selectActiveAccountName,
  selectActiveEntityId,
  selectActiveEntityName,
  selectApproveEntities,
  selectApproveStatus,
  selectCanDoApprove,
  selectCountryOptions,
  selectDateRangeFormState,
  selectSelectedGroupedRefundNodes,
  State,
} from '../../store/reducers';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss'],
})
export class ApproveComponent implements OnDestroy, OnInit {
  public accountName$: Observable<string>;
  public activeAccountId$: Observable<number>;
  public activeEntityId$: Observable<string>;
  public canDoApprove$: Observable<boolean>;
  public countryOptions$: Observable<MultiSelectOption[]>;
  public dateRangeForm$: Observable<fromDateRangeForm.State>;
  public entityName$: Observable<string>;
  public groupedRefundsNodes$: Observable<GroupedRefundNodes>;
  public isAdmin$: Observable<boolean>;
  public isApproving = false;
  public potentialForAccount$: Observable<Potential>;
  public potentialForEntity$: Observable<Potential>;
  public refundEntities$: Observable<RefundEntity[]>;
  public status$: Observable<ApproveStatus>;

  private componentDestroyed$ = new Subject();

  constructor(
    private approveService: ApproveService,
    private dialog: MatDialog,
    private dvrService: DvrService,
    private route: ActivatedRoute,
    private store: Store<AppState & State>,
  ) {}

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();

    this.store.dispatch(new ResetDvr());
  }

  public ngOnInit() {
    this.setApproveHash();
    this.watchForApprove();

    this.potentialForAccount$ = this.dvrService.potentialForAccount$;
    this.potentialForEntity$ = this.dvrService.potentialForEntity$;

    this.accountName$ = this.store.pipe(select(selectActiveAccountName));
    this.activeAccountId$ = this.store.pipe(select(selectActiveAccountId));
    this.activeEntityId$ = this.store.pipe(select(selectActiveEntityId));
    this.canDoApprove$ = this.store.pipe(select(selectCanDoApprove));
    this.countryOptions$ = this.store.pipe(select(selectCountryOptions));
    this.dateRangeForm$ = this.store.pipe(select(selectDateRangeFormState));
    this.entityName$ = this.store.pipe(select(selectActiveEntityName));
    this.groupedRefundsNodes$ = this.store.pipe(select(selectSelectedGroupedRefundNodes));
    this.isAdmin$ = this.store.pipe(select(selectIsAdmin));
    this.refundEntities$ = this.store.pipe(select(selectApproveEntities));
    this.status$ = this.store.pipe(select(selectApproveStatus));

    this.setCountriesRequest();
  }

  private setApproveHash(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.store.dispatch(new SetApproveHash({ approveHash: paramMap.get('hash') }));
    });
  }

  private watchForApprove(): void {
    this.approveService.approve$.pipe(takeUntil(this.componentDestroyed$)).subscribe();
  }

  private setCountriesRequest(): void {
    this.store.dispatch(new SetCountries());
  }

  public doApprove(): void {
    this.isApproving = true;

    this.approveService.doApprove().add(() => (this.isApproving = false));
  }

  public removeCase(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.componentInstance.message = `You are about to permanently delete this case. Are you sure?`;
    dialogRef.componentInstance.approveButtonName = 'Yes';
    dialogRef.componentInstance.denyButtonName = 'No';
    dialogRef.componentInstance.dialogStyleClass = DialogStyleClass.info;

    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) {
        this.approveService.removeCase().subscribe();
      }
    });
  }
}
