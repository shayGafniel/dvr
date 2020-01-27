import {Account} from '~/common/services/account/account.model';

export const getMockVatBoxAccounts: () => Account[] = () => {
  return [
    {accountId: 3101, accountName: 'Eli Lilly'},
    {accountId: 22222, accountName: 'Amazon'},
    {accountId: 33333, accountName: 'Nike'},
  ];
};
