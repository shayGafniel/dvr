import { Injectable } from '@angular/core';
import { GateApiService } from '~/common/services/gate/gate-api.service';
import {
  FilteredGroupsResponse,
  GroupFilterItem,
} from '~/common/models/invoices-models/filters-data.model';
import { Account } from '~/common/services/account/account.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AccountsService {
  constructor(protected gateApiService: GateApiService) {}

  public getAllAccounts(): Observable<Account[]> {
    return this.gateApiService.getAllCompanyGroups().pipe(
      map((filteredGroupsResponse: FilteredGroupsResponse) => {
        return filteredGroupsResponse.companies.map((groupFilterItem: GroupFilterItem) => {
          return { accountName: groupFilterItem.name, accountId: groupFilterItem.id, countryCode: groupFilterItem.country };
        });
      }),
    );
  }
}
