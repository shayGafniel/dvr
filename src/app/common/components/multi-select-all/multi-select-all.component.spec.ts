import { Component, Input } from '@angular/core';
import { FormArrayState } from 'ngrx-forms';

import { MultiSelectOption } from '../../models/multy-select.model';
import { MultiSelectAllComponent } from './multi-select-all.component';

@Component({
  selector: 'common-multi-select-all',
  template: '',
})
export class MultiSelectAllStubComponent implements Partial<MultiSelectAllComponent> {
  @Input()
  public allOptionValue: string;
  @Input()
  public ngrxFormControlStateArray: FormArrayState<any>;
  @Input()
  public options: MultiSelectOption[];
  @Input()
  public placeholder: string;
}
