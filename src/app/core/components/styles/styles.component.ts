import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-styles',
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.scss'],
})
export class StylesComponent {
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartData: ChartDataSets[] = [
    { data: [100, 200, 250], label: 'Refunded' },
    { data: [120, 230, 270], label: 'Submitted' },
    { data: [140, 250, 300], label: 'Potential' },
  ];
  public lineChartLabels: Label[] = ['2017', '2018', '2019'];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          ticks: {
            fontColor: 'gray',
          },
        },
      ],
    },
    annotation: {
      // annotations: [
      //   {
      //     type: 'line',
      //     mode: 'vertical',
      //     scaleID: 'x-axis-0',
      //     value: 'March',
      //     borderColor: 'orange',
      //     borderWidth: 2,
      //     label: {
      //       active: false,
      //       fontColor: 'orange',
      //       content: 'LineAnno',
      //     },
      //   },
      // ],
    },
  };
  public lineChartColors: Color[] = [
    {
      // green
      backgroundColor: '#00c427',
      borderColor: '#00c427',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    {
      // blue
      backgroundColor: '#2ab8fc',
      borderColor: '#2ab8fc',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
    },
    {
      // grey
      backgroundColor: '#ced6df',
      borderColor: '#ced6df',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  public emailFormControl = new FormControl('', [Validators.required, Validators.email]);
}
