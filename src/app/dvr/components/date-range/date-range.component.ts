import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { isObject } from 'lodash-es';
import { Moment } from 'moment';
import { FormGroupState, NgrxValueConverter, NgrxValueConverters } from 'ngrx-forms';

import { VbDatepickerComponent } from '../../../common/modules/datepicker/datepicker/datepicker.component';
import { RangeValue } from '../../models/dvr.model';
import { yearMonthFormat } from '../../../shared/configurations/date.configuration';
import * as fromDateRangeForm from '../../store/date-range-form/date-range-form.reducer';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: yearMonthFormat },
  ],
})
export class DateRangeComponent implements OnInit {
  public readonly disabledTitle = 'You cannot change date as long as you have the chosen reasons.';

  @Input()
  public accountId: number;
  @Input()
  public entityId: string;
  @Input()
  public formState: fromDateRangeForm.State;

  @ViewChild('datepicker', {static: false})
  public datepicker: VbDatepickerComponent<Moment>;

  public dateValueConverter: NgrxValueConverter<Date | Moment, string> = {
    convertViewToStateValue(value: Moment) {
      if (value === null) {
        return null;
      }

      return NgrxValueConverters.dateToISOString.convertViewToStateValue(value.toDate());
    },
    convertStateToViewValue: NgrxValueConverters.dateToISOString.convertStateToViewValue,
  };

  constructor() {}

  public ngOnInit() {}

  public onMonthSelected(normalizedMonth: Moment) {
    this.datepicker.select(normalizedMonth);
    this.datepicker.close();
    this.reopenOnRangeEndSelecting();
  }

  private reopenOnRangeEndSelecting(): void {
    setTimeout(() => {
      if (!this.datepicker.isRangeEndSelected()) {
        this.datepicker.open();
      }
    }, 0);
  }

  public get dateRange(): FormGroupState<RangeValue> {
    return this.formState.controls.dateRanges.controls[this.accountId].controls[this.entityId];
  }

  public get isExistDateRange(): boolean {
    return (
      isObject(this.formState.controls.dateRanges) &&
      isObject(this.formState.controls.dateRanges.controls[this.accountId]) &&
      isObject(this.formState.controls.dateRanges.controls[this.accountId].controls[this.entityId])
    );
  }
}
