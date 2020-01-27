import { range } from 'lodash-es';
import * as moment from 'moment';

import { DashboardResponse } from '../../models/dashboard.model';
import { DashboardGraphsResponse } from '../../models/dashboard-graphs.model';
import { DashboardPromotionsResponse } from '~/dashboard/models/dashboard-promotions.model';

export class DashboardApiMock {
  public static readonly dashboard: DashboardResponse = {
    refund_potential: 850000,
    recovery_potential_by_data: 810525,

    overall_submitted: 450000,
    submitted_reissued: 100000,
    pending_submission: 200000,
    pending_submission_reissued: 46000,

    disqualified: 125000,
    need_your_input: 45000,
    need_your_input_count: 82,
    pending_reissue: 30000,

    overall_refunded: 250000,
    overall_refunded_reissued: 190000,
    pending_approval: 152530,
    pending_approval_reissued: 1000,

    incorrect_charges: 39000,
    rejected: 17470,
  };

  private static readonly labelsLength = 36;
  private static readonly labels = DashboardApiMock.getLabelDates();
  private static readonly values = DashboardApiMock.getValues();

  public static readonly dashboardGraphs: DashboardGraphsResponse = {
    refunded: DashboardApiMock.values,
    submitted: DashboardApiMock.getIncreasedValues(1),
    potential: DashboardApiMock.getIncreasedValues(2),
    disqualified: DashboardApiMock.values,
    labels: DashboardApiMock.labels,
  };

  public static readonly dashboardPromotion: DashboardPromotionsResponse = {
    dvr_potential: 100,
    vendor_direct: 200,
    compliance_trainer: 3000,
  };

  public static getDashboard(): DashboardResponse {
    return DashboardApiMock.dashboard;
  }

  public static getDashboardGraphs(): DashboardGraphsResponse {
    return DashboardApiMock.dashboardGraphs;
  }

  public static getDashboardPromotion(): DashboardPromotionsResponse {
    return DashboardApiMock.dashboardPromotion;
  }

  private static getLabelDates(): string[] {
    return range(0, DashboardApiMock.labelsLength)
      .map(i =>
        moment()
          .subtract(i, 'M')
          .format('YYYY-MM'),
      )
      .reverse();
  }

  private static getIncreasedValues(multiplier: number): number[] {
    return DashboardApiMock.values.map(
      i => i + multiplier * 30000 + Math.round(Math.random() * 10000),
    );
  }

  private static getValues(): number[] {
    return range(1, DashboardApiMock.labelsLength).reduce(
      (acc, i) => [...acc, i * 220 * Math.round(Math.random()) + acc[i - 1]],
      [10000],
    );
  }
}
