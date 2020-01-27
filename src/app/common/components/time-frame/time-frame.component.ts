import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material';

import { FilterSelection } from '../../models/common.model';
import { TimeFrame, timeFrames } from '../../models/time-frame.model';

export const timeFrameDefaultValue = TimeFrame.CurrentYear;

@Component({
  selector: 'time-frame',
  templateUrl: './time-frame.component.html',
})
export class TimeFrameComponent {
  public readonly customValue: TimeFrame = TimeFrame.Custom;
  public readonly timeFrames: FilterSelection[] = timeFrames;

  @Input()
  public value: TimeFrame = timeFrameDefaultValue;
  @Input()
  public disabled: boolean = false;
  @Output()
  public selectionChange = new EventEmitter<TimeFrame>();

  public selectNewTimeFrame(matSelectChange: MatSelectChange) {
    this.selectionChange.emit(matSelectChange.value);
  }

  public isCustomTimeFrame(): boolean {
    return this.value === this.customValue;
  }
}
