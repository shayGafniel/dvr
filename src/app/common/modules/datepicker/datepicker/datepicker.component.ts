import { Subject, Subscription } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  Optional,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Overlay } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MAT_DATEPICKER_SCROLL_STRATEGY,
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';

import { VbDatepickerContentComponent } from '../datepicker-content/datepicker-content.component';

@Component({
  selector: 'vb-datepicker',
  template: '',
  styleUrls: ['./datepicker.component.scss'],
  exportAs: 'vbDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VbDatepickerComponent<D> extends MatDatepicker<D> implements OnDestroy {
  /** The currently selected date. */
  get _selectedRangeEnd(): D | null {
    return this._validSelectedRangeEnd;
  }

  set _selectedRangeEnd(value: D | null) {
    this._validSelectedRangeEnd = value;
  }

  private _validSelectedRangeEnd: D | null = null;

  /** Emits new selected date when selected date changes. */
  public readonly _selectedChangedRangeEnd = new Subject<D>();
  public _range: boolean = false;

  public _datepickerInputRangeEnd: MatDatepickerInput<D>;
  private _inputRangeEndSubscription = Subscription.EMPTY;
  private _vbDialog: MatDialog;

  constructor(
    _vbDialog: MatDialog,
    private _vbOverlay: Overlay,
    private _vbNgZone: NgZone,
    private _vbViewContainerRef: ViewContainerRef,
    @Inject(MAT_DATEPICKER_SCROLL_STRATEGY) private _vbScrollStrategy,
    @Optional() private _vbDateAdapter: DateAdapter<D>,
    @Optional() private _vbDir: Directionality,
    @Optional()
    @Inject(DOCUMENT)
    private _vbDocument: any,
  ) {
    super(
      (_vbDialog = Object.create(_vbDialog)),
      _vbOverlay,
      _vbNgZone,
      _vbViewContainerRef,
      _vbScrollStrategy,
      _vbDateAdapter,
      _vbDir,
      _vbDocument,
    );

    // _popupComponentRef
    this._vbDialog = _vbDialog;
    this._vbDialog.open = <any>function(...args: any[]) {
      if (typeof args[0].createEmbeddedView !== 'function') {
        args[0] = VbDatepickerContentComponent;
      }
      return MatDialog.prototype.open.apply(_vbDialog, args);
    };

    Object.defineProperty(this, '_calendarPortal', {
      get: function() {
        return this['__calendarPortal'];
      },
      set: function(value) {
        this['__calendarPortal'] = value;
        if (value) {
          value.component = VbDatepickerContentComponent;
        }
      },
    });
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this._inputRangeEndSubscription.unsubscribe();
  }

  public isRangeEndSelected(): boolean {
    return Boolean(this._selectedRangeEnd);
  }

  public _selectMonth(normalizedMonth: D): void {
    super._selectMonth(normalizedMonth);
  }

  public _selectYear(normalizedYear: D): void {
    super._selectYear(normalizedYear);
  }

  public select(date: D): void {
    if (!this._range) {
      this._selectRangeStart(date);
    } else {
      this._selectRange(date);
    }
  }

  private _selectRangeStart(date: D): void {
    super.select(date);
  }

  private _selectRange(date: D): void {
    if (!date) {
      this._resetRange();
    } else if (!this._selected || this._selectedRangeEnd) {
      this._selectStartAndResetEnd(date);
    } else {
      this._selectEndOrSwap(date);
    }
  }

  private _resetRange(): void {
    if (this._selected && this._selectedRangeEnd) {
      this._selectRangeStart(null);
      this._selectRangeEnd(null);
    } else if (this._selected) {
      this._selectRangeStart(null);
    } else if (this._selectedRangeEnd) {
      this._selectRangeEnd(null);
    }
  }

  private _selectStartAndResetEnd(date: D): void {
    if (this._selectedRangeEnd) {
      this._selectRangeEnd(null);
    }
    this._selectRangeStart(date);
  }

  private _selectEndOrSwap(date: D): void {
    if (date < this._selected) {
      this._selectAndSwap(date);
    } else if (date >= this._selected) {
      this._selectRangeEnd(date);
    }
  }

  private _selectAndSwap(date: D): void {
    const swap = this._selected;
    this._selectRangeStart(date);
    this._selectRangeEnd(swap);
  }

  public _userSelection(): void {
    if (!this._range || (this._selected && this._selectedRangeEnd)) {
      this.close();
    }
  }

  public _registerInputRangeEnd(input: MatDatepickerInput<D>): void {
    if (this._datepickerInputRangeEnd) {
      throw Error('A MatDatepicker can only be associated with a single range end input.');
    }
    this._datepickerInputRangeEnd = input;
    this._range = !!input;

    this._inputRangeEndSubscription.unsubscribe();
    if (this._range) {
      this._inputRangeEndSubscription = this._datepickerInputRangeEnd._valueChange.subscribe(
        (value: D | null) => (this._selectedRangeEnd = value),
      );
    }
  }

  public _unregisterInputRangeEnd(input?: MatDatepickerInput<D>): void {
    if (this._datepickerInputRangeEnd) {
      if (!input || input === this._datepickerInputRangeEnd) {
        this._datepickerInputRangeEnd = undefined;
        this._range = false;
        this._inputRangeEndSubscription.unsubscribe();
      }
    }
  }

  private _selectRangeEnd(date: D): void {
    const oldValue = this._selectedRangeEnd;
    this._selectedRangeEnd = date;
    if (!this._vbDateAdapter.sameDate(oldValue, this._selectedRangeEnd)) {
      this._selectedChangedRangeEnd.next(this._selectedRangeEnd);
    }
  }
}
