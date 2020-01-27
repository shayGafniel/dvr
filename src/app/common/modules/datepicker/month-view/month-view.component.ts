import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { MatMonthView } from '@angular/material/datepicker';

@Component({
  selector: 'vb-month-view',
  templateUrl: './month-view.component.html',
  exportAs: 'matMonthView',
  styleUrls: ['./month-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VbMonthViewComponent<D> extends MatMonthView<D> {
  public _selectedRangeEndDate: number | null;

  @Input()
  public range: boolean;

  @Input()
  get selectedRangeEnd(): D | null {
    return this._selectedRangeEnd;
  }

  set selectedRangeEnd(value: D | null) {
    this._selectedRangeEnd = (<any>this)._getValidDateOrNull(
      (<any>this)._dateAdapter.deserialize(value),
    );
    this._selectedRangeEndDate = (<any>this)._getDateInCurrentMonth((<any>this)._selectedRangeEnd);
  }

  get _allInRange(): boolean {
    if (!this.range || !this.activeDate || !this.selectedRangeEnd || !this.selected) {
      return false;
    } else {
      const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
      const startDate = this.createDate(1);
      const endDate = this.createDate(daysInMonth);

      return (
        this._dateAdapter.compareDate(this.selected, startDate) < 0 &&
        this._dateAdapter.compareDate(this.selectedRangeEnd, endDate) > 0
      );
    }
  }

  get _rangable(): boolean {
    if (!this.range || !this._weeks) {
      return false;
    } else {
      const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
      const startDate = this.createDate(1);
      const endDate = this.createDate(daysInMonth);

      if (this.selectedRangeEnd < startDate) {
        return false;
      }

      if (this.selected > endDate) {
        return false;
      }

      return true;
    }
  }

  private get _currentDate(): number {
    return new Date().getDate();
  }

  private get _currentYear(): number {
    return new Date().getFullYear();
  }

  private get _currentMonth(): number {
    return new Date().getMonth();
  }

  private _selectedRangeEnd: D | null;

  @Output()
  public readonly selectedRangeEndChange: EventEmitter<D> = new EventEmitter<D>();

  public _init() {
    this._selectedRangeEndDate = (<any>this)._getDateInCurrentMonth(this.selectedRangeEnd);
    super._init();
  }

  public selectToday(): void {
    this.activeDate = this._dateAdapter.createDate(
      this._currentYear,
      this._currentMonth,
      this._currentDate,
    );
    super._dateSelected(this._currentDate);
    this._dateSelectedRangeEnd(this._currentDate);
  }

  public selectYesterday() {
    this.activeDate = this._dateAdapter.createDate(
      this._currentYear,
      this._currentMonth,
      this._currentDate,
    );
    super._dateSelected(this._currentDate - 1);
    this._dateSelectedRangeEnd(this._currentDate - 1);
  }

  public selectLastSevenDays(): void {
    this.activeDate = this._dateAdapter.createDate(
      this._currentYear,
      this._currentMonth,
      this._currentDate,
    );
    if (this._currentDate - 6 <= 0) {
      this.activeDate = this._dateAdapter.createDate(
        this._currentYear,
        this._currentMonth - 1,
        this._currentDate,
      );
      const firstDay: Date = new Date(
        this._currentYear,
        this._currentMonth - 1,
        this._currentDate - 29,
      );
      super._dateSelected(firstDay.getDate());
    } else {
      super._dateSelected(this._currentDate - 6);
    }
    this.activeDate = this._dateAdapter.createDate(
      this._currentYear,
      this._currentMonth,
      this._currentDate,
    );
    this._dateSelectedRangeEnd(this._currentDate);
  }

  public selectLastThirtyDays(): void {
    this.activeDate = this._dateAdapter.createDate(
      this._currentYear,
      this._currentMonth,
      this._currentDate,
    );
    if (this._currentDate - 29 <= 0) {
      this.activeDate = this._dateAdapter.createDate(
        this._currentYear,
        this._currentMonth - 1,
        this._currentDate,
      );
      const firstDay: Date = new Date(
        this._currentYear,
        this._currentMonth - 1,
        this._currentDate - 29,
      );
      super._dateSelected(firstDay.getDate());
    } else {
      super._dateSelected(this._currentDate - 29);
    }
    this.activeDate = this._dateAdapter.createDate(
      this._currentYear,
      this._currentMonth,
      this._currentDate,
    );
    this._dateSelectedRangeEnd(this._currentDate);
  }

  public getCurrentMonth() {
    this.activeDate = this._dateAdapter.createDate(
      this._currentYear,
      this._currentMonth,
      this._currentDate,
    );
    const firstDay: Date = new Date(this._currentYear, this._currentMonth, 1);
    const lastDay: Date = new Date(this._currentYear, this._currentMonth + 1, 0);
    super._dateSelected(firstDay.getDate());
    this._dateSelectedRangeEnd(lastDay.getDate());
  }

  public getLastMonth() {
    this.activeDate = this._dateAdapter.createDate(
      this._currentYear,
      this._currentMonth - 1,
      this._currentDate,
    );
    const firstDay: Date = new Date(this._currentYear, this._currentMonth - 1, 1);
    const lastDay: Date = new Date(this._currentYear, this._currentMonth, 0);
    super._dateSelected(firstDay.getDate());
    this._dateSelectedRangeEnd(lastDay.getDate());
  }

  public _dateSelected(date: number) {
    if (!this.range) {
      super._dateSelected(date);
    } else {
      if (!this.selected || this.selectedRangeEnd) {
        if (this._selectedRangeEnd) {
          this._dateSelectedRangeEnd(null);
        }
        super._dateSelected(date);
      } else {
        if (date === null) {
          this._dateSelectedRangeEnd(null);
        } else {
          const selectedDate = this.createDate(date);
          if (selectedDate < this.selected) {
            const swap = this._selectedDate;
            super._dateSelected(date);
            this._dateSelectedRangeEnd(swap);
          } else {
            this._dateSelectedRangeEnd(date);
          }
        }
      }
    }
  }

  private _dateSelectedRangeEnd(date: number | null) {
    if (date === null) {
      this.selectedRangeEndChange.emit(null);
    } else {
      const selectedDate = this.createDate(date);
      this.selectedRangeEndChange.emit(selectedDate);
      this._userSelection.emit();
    }
  }

  private createDate(date: number): D {
    const selectedYear = this._dateAdapter.getYear(this.activeDate);
    const selectedMonth = this._dateAdapter.getMonth(this.activeDate);
    return this._dateAdapter.createDate(selectedYear, selectedMonth, date);
  }
}
