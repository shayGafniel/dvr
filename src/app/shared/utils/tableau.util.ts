import {
  companyAllValueId, getAllValue,
  getCountriesAllValue,
  getDirectivesAllValue,
} from '../configurations/filter.configuration';
import { MainFiltersKey, TableauPaidBy } from '../models/main-filters.model';
import {
  MainFiltersMappedKey,
  tableauFiltersKeyMap,
  TableauParamKey,
  tableauParamsKeyMap,
  TableauValue,
} from '../models/tableau.model';
import { TableauFilterKey } from '~/shared/models/tableau.model';

export class TableauUtil {
  public static getTableauFiltersKey(key: MainFiltersKey): TableauFilterKey {
    return tableauFiltersKeyMap[key] as TableauFilterKey;
  }

  public static getTableauParamsKey(key: MainFiltersKey): TableauParamKey {
    return tableauParamsKeyMap[key] as TableauParamKey;
  }

  public static getTableauKey(key: MainFiltersKey): TableauFilterKey | TableauParamKey {
    return TableauUtil.getTableauFiltersKey(key) || TableauUtil.getTableauParamsKey(key);
  }

  public static getTableauValue(key: MainFiltersMappedKey, value: any): TableauValue {
    switch (key) {
      case 'invoiced_at_from':
      case 'invoiced_at_to':
        return '';

      case 'company_group':
        return value ? [value.name] : null;

      case 'companies':
        return this.companyIdsToDashboard(value);

      case 'countries':
      case 'origin_countries':
        return value ? searchObjects(value, getCountriesAllValue()[0].code, 'code') : null;

      case 'directives_invoices':
        return value ? searchObjects(value, getDirectivesAllValue()[0].value, 'value') : null;

      case 'expense_domains':
        return value ? searchObjects(value, -1, 'value') : null;

      case 'expense_type_by':
        return value;

      case 'paid_by':
        return value ? TableauPaidBy[value] : null;

      case 'expense_types':
        return value ? searchObjects(value, -1, 'value') : null;

      case 'reject_reasons':
        return value ? searchObjects(value, getAllValue()[0].value, 'value') : null;

      default:
        return value;
    }
  }

  private static companyIdsToDashboard(companies) {
    if (companies) {
      const companiesWithoutSpecialOption = companies
        .map(i => i.id)
        .filter(i => i !== companyAllValueId);
      if (companiesWithoutSpecialOption.length) {
        return companiesWithoutSpecialOption.map(i => i.toString());
      }
    }
  }
}

function searchObjects<T>(listOfObjects: T[], defaultValue: number | string, keyName: string): T[] {
  return listOfObjects.map(i => i[keyName]).filter(i => i !== defaultValue);
}
