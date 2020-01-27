export interface Account {
  accountId: number;
  accountName: string;
  countryCode?: string;
}

export interface AccountNames {
  [accountId: string]: string;
}
