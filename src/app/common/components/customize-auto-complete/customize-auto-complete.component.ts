import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'app-customize-auto-complete',
  templateUrl: './customize-auto-complete.component.html',
  styleUrls: ['./customize-auto-complete.component.scss'],
})
export class CustomizeAutoCompleteComponent<T> implements OnInit {
  private _listOfOptions: any[] = [];
  @Output() public selectedValue = new EventEmitter<T>();

  @Input()
  public set defaultValue(defaultValue: any) {
    if (!!defaultValue) this.autocompleteFormControl.setValue(defaultValue);
  }

  @Input()
  public set listOfOptions(options: T[]) {
    if (!!options) {
      this._listOfOptions = options;
    }
  }

  @Input()
  public set disabled(isDisabled: boolean) {
    if (!!isDisabled) {
      this.autocompleteFormControl.disable();
    } else {
      this.autocompleteFormControl.enable();
    }
  }

  @Input() public fieldNameToView = 'name';
  @Input() public placeHolderName = '';
  @Input() public isCurrency = false;
  public autocompleteFormControl = new FormControl();
  public filteredOptions$: Observable<any[]>;

  constructor() {
  }

  public ngOnInit() {
    this.initAutocompleteFromControl();
  }

  public initAutocompleteFromControl(): void {
    this.filteredOptions$ = this.autocompleteFormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map((val: string | T) => {
        if (typeof val === 'object') {
          this.selectedValue.emit(val);
          return this._listOfOptions.slice(); // Copy
        } else if (typeof val === 'string') {
          return this._listOfOptions.filter((option: any) => {
            return !!option && option[this.fieldNameToView].toLowerCase().includes(val.toLocaleLowerCase());
          });
        }
      }),
    );
  }

  public displayGroupName(option: any): string {
    if (option && option[this.fieldNameToView]) {
      return this.isCurrency ? `${ option[this.fieldNameToView] } (${ option.code })` : option[this.fieldNameToView];
    }
    return '';
  }
}
