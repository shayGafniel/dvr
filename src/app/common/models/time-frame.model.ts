import * as moment from 'moment';
import { FilterSelection } from './common.model';

export enum TimeFrame {
  CurrentYear = 'current',
  LastYear = '1y',
  TwoYearsAgo = '2y',
  Custom = 'custom',
}

export const timeFrames: FilterSelection[] = [
  { value: TimeFrame.CurrentYear, viewValue: moment().format('YYYY') },
  {
    value: TimeFrame.LastYear,
    viewValue: moment()
      .subtract(1, 'y')
      .format('YYYY'),
  },
  {
    value: TimeFrame.TwoYearsAgo,
    viewValue: moment()
      .subtract(2, 'y')
      .format('YYYY'),
  },
];
