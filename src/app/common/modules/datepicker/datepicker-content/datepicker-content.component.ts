import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatCalendar, MatDatepickerContent } from '@angular/material/datepicker';

import { VbDatepickerComponent } from '../datepicker/datepicker.component';
import { VbCalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'vb-datepicker-content',
  templateUrl: './datepicker-content.component.html',
  exportAs: 'matDatepickerContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VbDatepickerContentComponent<D> extends MatDatepickerContent<D>
  implements AfterViewInit {
  @ViewChild(VbCalendarComponent, {static: false})
  public _calendar: MatCalendar<D>;

  @HostBinding('class.mat-datepicker-content')
  public contentClass: boolean = true;

  @HostBinding('class.mat-datepicker-content-touch')
  public get touchClass(): boolean {
    return this.datepicker.touchUi;
  }

  @HostBinding('class.vb-datepicker-range')
  public get rangeClass(): boolean {
    return this.datepicker['_range'];
  }

  get vbDatepicker(): VbDatepickerComponent<D> {
    return <any>this.datepicker;
  }

  public ngAfterViewInit() {}

  public onMonthSelected(normalizedMonth: D): void {
    this.vbDatepicker._selectMonth(normalizedMonth);
  }

  public onUserSelection(): void {
    this.vbDatepicker._userSelection();
  }

  public onYearSelected(normalizedYear: D): void {
    this.vbDatepicker._selectYear(normalizedYear);
  }
}
