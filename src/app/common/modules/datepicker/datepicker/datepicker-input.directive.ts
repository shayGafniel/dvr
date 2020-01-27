import {
  AfterContentInit,
  Directive,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';

import { VbDatepickerComponent } from './datepicker.component';

@Directive({
  selector: '[vbDatepicker]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VbDatepickerInputDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VbDatepickerInputDirective),
      multi: true,
    },
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: VbDatepickerInputDirective },
  ],
  exportAs: 'vbDatepickerInput',
})
export class VbDatepickerInputDirective<D> extends MatDatepickerInput<D>
  implements AfterContentInit, OnDestroy {
  private _vbDatepickerSubscription = Subscription.EMPTY;

  @HostBinding('attr.aria-haspopup')
  public haspopup: boolean = true;

  @HostBinding('attr.min')
  public get isMin(): string {
    return this.min ? this._dateAdapter.toIso8601(this.min) : null;
  }

  @HostBinding('attr.max')
  public get isMax(): string {
    return this.max ? this._dateAdapter.toIso8601(this.max) : null;
  }

  @HostBinding('disabled')
  public get isDisabled(): boolean {
    return this.disabled;
  }

  constructor(
    private _vbElementRef: ElementRef,
    @Optional() public _vbDateAdapter: DateAdapter<D>,
    @Optional()
    @Inject(MAT_DATE_FORMATS)
    private _vbDateFormats: MatDateFormats,
    @Optional() private _vbFormField: MatFormField,
  ) {
    super(_vbElementRef, _vbDateAdapter, _vbDateFormats, _vbFormField);
  }

  @HostListener('input', ['$event'])
  public onInput($event) {
    this._onInput($event.target.value);
  }

  @HostListener('change')
  public onChange() {
    this._onChange();
  }

  @HostListener('blur')
  public onBlur() {
    this._onTouched();
  }

  @HostListener('keydown', ['$event'])
  public onKeydown($event) {
    this._onKeydown($event);
  }

  @Input()
  set vbDatepicker(value: VbDatepickerComponent<D>) {
    if (this._datepicker !== value) {
      this.unregister();
      this._datepicker = value;
      value._registerInputRangeEnd(this);
    }
  }

  private _vbCvaOnChange: (value: any) => void = () => {};

  private get _vbDatepicker(): VbDatepickerComponent<D> {
    return <any>this._datepicker;
  }

  public ngAfterContentInit() {
    if (this._datepicker) {
      this._vbDatepickerSubscription = this._vbDatepicker._selectedChangedRangeEnd.subscribe(
        (selected: D) => {
          this.value = selected;
          this._vbCvaOnChange(selected);
          this._onTouched();
          this.dateInput.emit(new MatDatepickerInputEvent(this, this._vbElementRef.nativeElement));
          this.dateChange.emit(new MatDatepickerInputEvent(this, this._vbElementRef.nativeElement));
        },
      );
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unregister();
    this._vbDatepickerSubscription.unsubscribe();
  }

  // Implemented as part of ControlValueAccessor.
  public registerOnChange(fn: (value: any) => void): void {
    this._vbCvaOnChange = fn;
    super.registerOnChange(fn);
  }

  private unregister(): void {
    if (this._vbDatepicker) {
      this._vbDatepicker._unregisterInputRangeEnd(this);
    }
  }
}
