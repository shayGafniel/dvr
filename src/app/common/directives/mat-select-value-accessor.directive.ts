import { Directive, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material';

// tslint:disable:directive-selector
// tslint:disable:directive-class-suffix
// necessary since material 2 does not properly declare the mat-select as a NG_VALUE_ACCESSOR
@Directive({
  selector: 'mat-select[ngrxFormControlState]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgrxMatSelectValueAccessor),
      multi: true,
    },
  ],
})
export class NgrxMatSelectValueAccessor implements ControlValueAccessor {
  constructor(private matSelect: MatSelect) {}

  public writeValue(value: any): void {
    // we have to verify that the same value is not set again since that would
    // cause focus to get lost on the select since it tries to focus the active option
    const selectedOption = this.matSelect.selected;
    if (selectedOption) {
      if (Object.prototype.toString.call(selectedOption) !== '[object Array]') {
        const selectedValue = (<MatOption>selectedOption).value;
        if (value === selectedValue) {
          return;
        }
      } else {
        // do nothing
      }
    }

    // because the options are potentially updated AFTER the value (because of their order in the DOM),
    // setting the value has to be deferred, otherwise we might select an option which is not available yet.
    Promise.resolve().then(() => (this.matSelect.value = value));
  }

  public registerOnChange(fn: any): void {
    this.matSelect.registerOnChange(fn);
  }

  public registerOnTouched(fn: any): void {
    this.matSelect.registerOnTouched(fn);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.matSelect.setDisabledState(isDisabled);
  }
}
