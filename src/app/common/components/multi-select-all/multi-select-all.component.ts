import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatSelect } from '@angular/material';
import { FormArrayState, unbox } from 'ngrx-forms';

import { MultiSelectOption } from '../../models/multy-select.model';

@Component({
  selector: 'common-multi-select-all',
  templateUrl: './multi-select-all.component.html',
  styleUrls: ['./multi-select-all.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MultiSelectAllComponent implements OnChanges {
  public isDisabledOtherOptions = false;

  @Input()
  public allOptionValue: string;
  @Input()
  public ngrxFormControlStateArray: FormArrayState<string>;
  @Input()
  public options: MultiSelectOption[];
  @Input()
  public placeholder: string;

  @ViewChild(MatSelect, {static: false})
  public selectEl: MatSelect;

  constructor() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['ngrxFormControlStateArray']) {
      this.checkAllBehaviour(unbox(this.ngrxFormControlStateArray.value));
    }
  }

  private checkAllBehaviour(values: string[]): void {
    if (!this.isDisabledOtherOptions && values.includes(this.allOptionValue)) {
      this.selectEl.writeValue([this.allOptionValue]);
    }
    this.isDisabledOtherOptions = values.includes(this.allOptionValue);
  }

  public hasAllOption(): boolean {
    return Boolean(this.options.find(option => option.value === this.allOptionValue));
  }
}
