import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Account } from '~/common/services/account/account.model';
import { getMockVatBoxAccounts } from '~/core/services/accounts/accounts-mock.data';

@Injectable()
export class AccountMockService {
  constructor() {}

  public getAllAccounts(): Observable<Account[]> {
    return of(getMockVatBoxAccounts()).pipe(delay(500));
  }
}
