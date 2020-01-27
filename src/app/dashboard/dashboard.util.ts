import { get, invoke } from 'lodash-es';
import * as moment from 'moment';

import { Company } from '~/common/services/gate/models/rails-data.model';
import {DashboardFilters, DashboardGraphsFilters, PromotionFilters} from './models/dashboard.model';
import {
  companyAllValueId,
  getAllValue,
  getCountriesAllValue,
  getDirectivesAllValue,
  getExpenseDomainsAllValue,
} from '~/shared/configurations/filter.configuration';
import { MainFilters } from '~/shared/models/main-filters.model';
import { CommonUtil } from '~/shared/utils/common.util';
import { MainFiltersUtil } from '~/shared/utils/main-filters.util';

export class DashboardUtil {
  public static generateDashboardFilters(accountId: number, mainFilters: MainFilters): DashboardFilters {
    return CommonUtil.clearObject({
      date_from: moment(mainFilters.invoiced_at_from).format('YYYY-MM'),
      date_to: moment(mainFilters.invoiced_at_to).format('YYYY-MM'),
      entity_id: this.companyIdsToDashboard(mainFilters.companies),
      group_id: accountId,
      countries:
        mainFilters.countries &&
        mainFilters.countries.map(i => i.code).filter(i => i !== getCountriesAllValue()[0].code),
      origin_countries:
        mainFilters.origin_countries &&
        mainFilters.origin_countries
          .map(i => i.code)
          .filter(i => i !== getCountriesAllValue()[0].code),
      expense_domains:
        mainFilters.expense_domains &&
        mainFilters.expense_domains
          .map(i => i.value)
          .filter(i => i !== getExpenseDomainsAllValue()[0].value),
      directives:
        mainFilters.directives_invoices &&
        mainFilters.directives_invoices
          .map(i => i.value)
          .filter(i => i !== getDirectivesAllValue()[0].value),
      paid_by: mainFilters.paid_by,
      expense_types:
        mainFilters.expense_types &&
        mainFilters.expense_types
          .map(i => i.value)
          .filter(i => i !== getAllValue()[0].value),
    });
  }

  private static companyIdsToDashboard(companies: Company[]): string[] {
    if (companies) {
      const ids = companies.filter(i => i.id !== companyAllValueId).map(i => i.id.toString());

      return ids.length === 0 ? undefined : ids;
    }
  }

  public static generateDashboardGraphsFilters(
    accountId: number,
    mainFilters: MainFilters,
    allCompanies: Company[]): DashboardGraphsFilters {

    let companies = [ ...mainFilters.companies ];
    if (MainFiltersUtil.noCompaniesFilled({companies: companies})) {
      companies = allCompanies;
    }

    return CommonUtil.clearObject({
      entity_id: this.companyIdsToDashboard(companies),
      group_id: accountId.toString(),
    });
  }

  public static generatePromotionFilters(accountId: number, mainFilters: MainFilters): PromotionFilters {
    return {
      group_id: accountId.toString(),
      date_from: mainFilters.invoiced_at_from && mainFilters.invoiced_at_from.substring(0, 7),
      date_to: mainFilters.invoiced_at_to && mainFilters.invoiced_at_to.substring(0, 7)
    };
  }

  public static isFilledDashboardFilters(dashboardFilters: DashboardFilters): boolean {
    return dashboardFilters.group_id && dashboardFilters.group_id !== companyAllValueId;
  }

  public static isFilledDashboardGraphsFilters(graphsFilters: DashboardGraphsFilters): boolean {
    return graphsFilters.group_id && graphsFilters.group_id !== companyAllValueId.toString();
  }

  public static isFilledDashboardEntities(filters: DashboardGraphsFilters): boolean {
    return !!filters.entity_id && !!filters.entity_id.length;
  }

  public static isFilledPromotionFilter(filters: PromotionFilters): boolean {
    return !!filters.group_id && parseInt(filters.group_id, 10) > 0 && !!filters.date_from && !!filters.date_to;
  }
}
