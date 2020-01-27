import { MatDateFormats } from '@angular/material';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
const dateFormatString = 'LL';

export const dateFormat: MatDateFormats = {
  parse: {
    dateInput: dateFormatString,
  },
  display: {
    dateInput: dateFormatString,
    monthYearLabel: dateFormatString,
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'L',
  },
};

const yearMonthFormatString = 'MM/YYYY';

export const yearMonthFormat: MatDateFormats = {
  parse: {
    dateInput: yearMonthFormatString,
  },
  display: {
    dateInput: yearMonthFormatString,
    monthYearLabel: yearMonthFormatString,
    dateA11yLabel: yearMonthFormatString,
    monthYearA11yLabel: yearMonthFormatString,
  },
};
