import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatOption } from '@angular/material';
import { DragulaService } from 'ng2-dragula';
import { FormArrayState } from 'ngrx-forms';

import { MultiSelectOption } from '../../models/multy-select.model';

@Component({
  selector: 'common-multi-select-order',
  templateUrl: './multi-select-order.component.html',
  styleUrls: ['./multi-select-order.component.scss'],
})
export class MultiSelectOrderComponent implements AfterViewInit {
  public dragulaBag = `bag_${Math.round(Math.random() * 10000)}`;

  @Input()
  public ngrxFormControlStateArray: FormArrayState<any>;
  @Input()
  public options: MultiSelectOption[];
  @Input()
  public placeholder: string;

  @Output()
  public orderChange = new EventEmitter<string[]>();

  @ViewChildren('optionEl')
  public optionElements: QueryList<MatOption>;

  constructor(private dragulaService: DragulaService) {}

  public ngAfterViewInit() {
    this.setDragEventHandle();
  }

  private setDragEventHandle(): void {
    this.dragulaService.drop(this.dragulaBag).subscribe(() => {
      this.onOrderChange();
    });
  }

  private onOrderChange(): void {
    const selectedOptions = this.getSelectedOptionsValues();

    setTimeout(() => {
      this.orderChange.emit(this.getOptionsValues(selectedOptions));
    }, 0);
  }

  private getSelectedOptionsValues(): string[] {
    return this.optionElements.reduce(
      (accumulator: string[], option: MatOption) =>
        option.selected ? accumulator.concat(option.value) : accumulator,
      [],
    );
  }

  private getOptionsValues(selectedOptions: string[]): string[] {
    return this.optionElements.reduce(
      (accumulator: string[], option: MatOption) =>
        selectedOptions.includes(option.value) ? accumulator.concat(option.value) : accumulator,
      [],
    );
  }
}
