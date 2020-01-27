import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material';

import { FilterSelection } from '../../../common/models/common.model';

@Component({
  selector: 'app-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss'],
})
export class ButtonToggleComponent<T> {
  @Input()
  public disabled = false;
  @Input()
  public items: FilterSelection<T>[];
  @Input()
  public label: string;
  @Input()
  public value: T;

  @Output()
  public change = new EventEmitter<T>();

  public onChange(toggleChange: MatButtonToggleChange) {
    this.change.emit(toggleChange.value);
  }
}
