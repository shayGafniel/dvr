import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Slice } from '../../models/pie-chart.model';

@Component({
  selector: 'app-linear-chart',
  templateUrl: './linear-chart.component.html',
  styleUrls: ['./linear-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinearChartComponent implements OnInit {
  @Input()
  public slices: Slice[] = [];

  constructor() {}

  public ngOnInit() {}
}
