import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { SummaryCounts, SummaryStatic } from '../../models/summary-line.model';

@Component({
  selector: 'app-summary-line',
  templateUrl: './summary-line.component.html',
  styleUrls: ['./summary-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryLineComponent implements OnInit {
  public currSummary = 'Total';
  @Input()
  public summaryCounts: SummaryCounts;
  @Input()
  public summaryOrder: string[];
  @Input()
  public summaryStatic: SummaryStatic;
  @Input()
  public filterDate;
  @Input()
  public currencySymbol: string = 'EUR';
  @Input()
  public currencyConvertedByServer: boolean = false;
  @Input()
  public isAmountsPending: boolean;

  @Output()
  public summaryLineBlockClick: EventEmitter<string> = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) {
  }

  public ngOnInit() {
  }

  public getWidth(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `calc((100% - ${this.summaryOrder.length - 1} * 15px) / ${this.summaryOrder.length})`,
    );
  }

  public onSummaryLineBlockClick(scope) {
    this.summaryLineBlockClick.emit(scope);
  }

  public onClickSummary(index) {
    this.currSummary = this.summaryStatic[index].label;
  }
}
