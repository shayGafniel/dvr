import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatCalendarBody } from '@angular/material/datepicker';

@Component({
  selector: 'vb-calendar-body',
  templateUrl: './calendar-body.component.html',
  exportAs: 'matCalendarBody',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VbCalendarBodyComponent extends MatCalendarBody {
  @Input()
  public range: boolean;
  @Input()
  public allInRange: boolean;
  @Input()
  public selectedRangeEndValue: number;

  @HostBinding('class.mat-calendar-body')
  public bodyClass: boolean = true;

  @HostBinding('attr.role')
  public role: string = 'grid';

  @HostBinding('class.vb-calendar-body-range')
  public get bodyRange(): boolean {
    return this.range;
  }

  @HostBinding('attr.aria-readonly')
  public ariaReadonly: boolean = true;

  public _inRange(date: number): boolean {
    if (this.range) {
      if (this.allInRange) {
        return true;
      }

      if (this.selectedValue && !this.selectedRangeEndValue) {
        return date >= this.selectedValue;
      }
      if (this.selectedRangeEndValue && !this.selectedValue) {
        return date <= this.selectedRangeEndValue;
      }
      return date >= this.selectedValue && date <= this.selectedRangeEndValue;
    }
  }
}
