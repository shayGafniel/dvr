import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Path, Slice } from '../../models/pie-chart.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements OnInit {
  @Input()
  public donutHoleColor = 'white';
  @Input()
  public donutHoleThickness = 0.8;
  @Input()
  public slices: Slice[] = [];

  constructor() {}

  public static getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);

    return [x, y];
  }

  public ngOnInit() {}

  public getPathData(): Path[] {
    let cumulativePercent = 0;

    return this.slices.map(slice => {
      const [startX, startY] = PieChartComponent.getCoordinatesForPercent(cumulativePercent);

      // each slice starts where the last slice ended, so keep a cumulative percent
      cumulativePercent += slice.percent;
      const [endX, endY] = PieChartComponent.getCoordinatesForPercent(cumulativePercent);

      // if the slice is more than 50%, take the large arc (the long way around)
      const largeArcFlag = slice.percent > 0.5 ? 1 : 0;

      const d = [
        `M ${startX} ${startY}`, // Move
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
        `L 0 0`, // Line
      ].join(' ');

      return { color: slice.color, d };
    });
  }
}
