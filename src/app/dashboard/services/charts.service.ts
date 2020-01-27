import { Injectable } from '@angular/core';
import { ChartOptions, NestedTickOptions } from 'chart.js';
import { ceil, cloneDeep } from 'lodash-es';
import { Color } from 'ng2-charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbbreviateNumberPipe } from '~/common/pipes/abbreviate-number/abbreviate-number.pipe';
import { dashboardGraphsColors } from '../models/dashboard-graphs.model';

@Injectable()
export class ChartsService {
  private readonly fontFamily = 'Open Sans, sans-serif';
  private readonly fontSettings: Partial<NestedTickOptions> = {
    fontColor: '#a9b6c6',
    fontFamily: this.fontFamily,
    fontSize: 13,
    fontStyle: 'bold',
  };
  private readonly pointColor: Partial<Color> = {
    pointBackgroundColor: 'rgba(0,0,0,0)',
    pointBorderColor: 'rgba(0,0,0,0)',
    pointHoverBackgroundColor: 'rgba(0,0,0,0)',
    pointHoverBorderColor: 'rgba(0,0,0,0)',
  };

  private readonly chartOptions: ChartOptions = {
    aspectRatio: 2,
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
          ticks: {
            ...this.fontSettings,
            padding: 7,
          },
          time: {
            unit: 'year',
          },
          type: 'time',
        },
      ],
      yAxes: [
        {
          gridLines: {
            color: '#E4E7F2',
            drawBorder: false,
            tickMarkLength: 0,
            zeroLineWidth: 0,
          },
          ticks: {
            ...this.fontSettings,
            callback: (value: number) => this.modifyYTicks(value),
            maxTicksLimit: 3,
            padding: 7,
          },
        },
      ],
    },
    responsive: true,
    tooltips: {
      bodyFontFamily: this.fontFamily,
      footerFontFamily: this.fontFamily,
      titleFontFamily: this.fontFamily,
    },
  };
  public readonly firstChartColors: Color[] = [
    {
      backgroundColor: dashboardGraphsColors.refunded,
      borderColor: dashboardGraphsColors.refunded,
      ...this.pointColor,
    },
    {
      backgroundColor: dashboardGraphsColors.submitted,
      borderColor: dashboardGraphsColors.submitted,
      ...this.pointColor,
    },
    {
      backgroundColor: dashboardGraphsColors.potential,
      borderColor: dashboardGraphsColors.potential,
      ...this.pointColor,
    },
  ];
  public readonly averageChartColors: Color[] = [
    {
      backgroundColor: `${dashboardGraphsColors.disqualified}4d`,
      borderColor: dashboardGraphsColors.disqualified,
      ...this.pointColor,
    },
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: dashboardGraphsColors.disqualifiedAvg,
      ...this.pointColor,
    },
  ];

  constructor(private abbreviateNumber: AbbreviateNumberPipe) {}

  public getChartOptions(max$: Observable<number>): Observable<ChartOptions> {
    return max$.pipe(
      map(max => {
        const chartOptions = cloneDeep(this.chartOptions);
        const degreeOfRounding = max >= 100000 ? -`${max}`.length + 2 : -`${max}`.length + 1;
        chartOptions.scales.yAxes[0].ticks.max = ceil(max + max * 0.05, degreeOfRounding);

        return chartOptions;
      }),
    );
  }

  private modifyYTicks(value: number): string {
    return this.abbreviateNumber.transform(value, 2);
  }
}
