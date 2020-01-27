import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { TimeFrame } from '../../../common/models/time-frame.model';
import { getEntityAllValue } from '../../models/case.model';
import { MultiselectItem } from '../../../shared/models/multiselect.model';
import { State } from '../../store/cases-filter-form/cases-filter-form.state';

@Component({
  selector: 'app-cases-filter',
  templateUrl: './cases-filter.component.html',
  styleUrls: ['./cases-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasesFilterComponent implements OnInit {
  public readonly entityDefaultValue: MultiselectItem = getEntityAllValue();

  @Input()
  public formState: State;
  @Input()
  public multiselectEntities: MultiselectItem[];
  @Input()
  public multiselectSelectedEntities: MultiselectItem[];
  @Input()
  public selectedTimeFrame: TimeFrame;

  @Output()
  public filterReset = new EventEmitter();
  @Output()
  public setEntities = new EventEmitter<string[]>();
  @Output()
  public timeFrameSelect = new EventEmitter<TimeFrame>();

  constructor() {}

  public ngOnInit() {}

  public onFilterReset(): void {
    this.filterReset.emit();
  }

  public onSetEntities(items: MultiselectItem[]): void {
    this.setEntities.emit(items.map(item => item.id as string));
  }

  public onTimeFrameSelect(timeFrame: TimeFrame): void {
    this.timeFrameSelect.emit(timeFrame);
  }
}
