import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Injector,
  Input,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar, MatDatepickerIntl } from '@angular/material/datepicker';

@Component({
  selector: 'vb-calendar',
  templateUrl: './calendar.component.html',
  exportAs: 'matCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VbCalendarComponent<D> extends MatCalendar<D>
  implements AfterContentInit, AfterViewChecked {
  @HostBinding('class.mat-calendar')
  public calendarClass: boolean = true;
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
  }

  @Output()
  public readonly selectedRangeEndChange: EventEmitter<D> = new EventEmitter<D>();

  private _selectedRangeEnd: D | null;

  constructor(
    _intl: MatDatepickerIntl,
    @Optional() _dateAdapter: DateAdapter<D>,
    @Optional()
    @Inject(MAT_DATE_FORMATS)
    _dateFormats: MatDateFormats,
    changeDetectorRef: ChangeDetectorRef,
    private _vbInjector: Injector,
  ) {
    super(_intl, _dateAdapter, _dateFormats, changeDetectorRef);
  }

  public ngAfterContentInit(): void {
    super.ngAfterContentInit();
    const injector = Injector.create({
      providers: [{ provide: MatCalendar, useValue: this }],
      parent: this._vbInjector,
    });
    (<ComponentPortal<any>>this._calendarHeaderPortal).injector = injector;
  }

  public ngAfterViewChecked(): void {}

  public _dateSelectedRangeEnd(date: D): void {
    this.selectedRangeEndChange.emit(date);
  }
}
