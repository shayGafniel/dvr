import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArrayState } from 'ngrx-forms';

import { MultiSelectOption } from '../../models/multy-select.model';
import { MultiSelectOrderComponent } from './multi-select-order.component';

@Component({
  selector: 'common-multi-select-order',
  template: '',
})
export class MultiSelectOrderStubComponent implements Partial<MultiSelectOrderComponent> {
  @Input()
  public ngrxFormControlStateArray: FormArrayState<any>;
  @Input()
  public placeholder: string;
  @Input()
  public options: MultiSelectOption[];
  @Output()
  public orderChange = new EventEmitter<string[]>();
}
