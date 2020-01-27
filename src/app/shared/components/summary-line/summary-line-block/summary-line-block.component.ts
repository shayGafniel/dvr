import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterDate } from '../../../../shared/models/main-filters.model';
import { calcTimeFrameFormToday } from '../../../../common/utils/utils';

@Component({
  selector: 'app-summary-line-block',
  templateUrl: './summary-line-block.component.html',
  styleUrls: ['./summary-line-block.component.scss'],
})
export class SummaryLineBlockComponent implements OnInit {
  @Input()
  public clickedSummary;
  @Input()
  public amount: number;
  @Input()
  public count: number;
  @Input()
  public icon: string;
  @Input()
  public iconClass: string;
  @Input()
  public label: string;
  @Input()
  public scope: string;
  @Input()
  public currencySymbol: string = 'EUR';
  @Input()
  public filterDate: FilterDate = calcTimeFrameFormToday('1y');
  @Input()
  public currencyConvertedByServer: boolean;
  @Input()
  public isAmountsPending;

  @Output()
  public summaryLineBlockClick: EventEmitter<string> = new EventEmitter();

  public ngOnInit() {}

  public get activeItem() {
    return this.clickedSummary === this.label;
  }
  public clickEvent() {
    this.summaryLineBlockClick.emit(this.scope);
  }
}
