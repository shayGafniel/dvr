import { isString } from 'lodash-es';
import * as moment from 'moment';

import { TimeFrame } from '../../common/models/time-frame.model';
import { MainFilters, MainFiltersInvoicedAt } from '../models/main-filters.model';
import { companyAllValueId } from '../../shared/configurations/filter.configuration';

export class MainFiltersUtil {
  public static isValidAccountId(accountId: any): boolean {
    return !(!accountId || isNaN(parseInt(accountId, 10)) || parseInt(accountId, 10) < 0);
  }

  public static getInvoicedAt(mainFilters: MainFilters): MainFiltersInvoicedAt {
    const containsTimeFrame = isString(mainFilters.time_frame);
    const containsInvoicedAt = mainFilters.invoiced_at_from || mainFilters.invoiced_at_to;

    if (containsTimeFrame && !containsInvoicedAt) {
      return {
        invoiced_at_from: MainFiltersUtil.toTableauDate(
          MainFiltersUtil.getFromDate(mainFilters.time_frame),
        ),
        invoiced_at_to: MainFiltersUtil.toTableauDate(
          MainFiltersUtil.getUntilDate(mainFilters.time_frame),
        ),
      };
    }

    return {
      invoiced_at_from: mainFilters.invoiced_at_from,
      invoiced_at_to: mainFilters.invoiced_at_to,
    };
  }

  public static getFromDate(timeFrame: TimeFrame): moment.Moment {
    switch (timeFrame) {
      case TimeFrame.CurrentYear:
        return moment().startOf('year');

      case TimeFrame.LastYear:
        return moment()
          .startOf('y')
          .subtract(1, 'y');

      case TimeFrame.TwoYearsAgo:
        return moment()
          .startOf('y')
          .subtract(2, 'y');

      default:
        throw new TypeError(`Unexpected time frame value "${timeFrame}"`);
    }
  }
  public static getUntilDate(timeFrame: TimeFrame): moment.Moment {
    switch (timeFrame) {
      case TimeFrame.CurrentYear:
        return moment();

      case TimeFrame.LastYear:
        return moment()
          .startOf('y')
          .subtract(1, 'd');

      case TimeFrame.TwoYearsAgo:
        return moment()
          .startOf('y')
          .subtract(1, 'y')
          .subtract(1, 'd');

      default:
        throw new TypeError(`Unexpected time frame value "${timeFrame}"`);
    }
  }
  public static toTableauDate(date: moment.MomentInput): string {
    return moment(date).format('YYYY-MM-DD');
  }

  public static noCompaniesFilled(filters): boolean {
    return !filters.companies || filters.companies[0] && filters.companies[0].id === companyAllValueId;
  }
}
