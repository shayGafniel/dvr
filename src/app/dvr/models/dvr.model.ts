import { Account as OriginAccount } from '../../common/services/account/account.model';

export type Account = OriginAccount;

export interface AccountEntity {
  countries: string[];
  id: string;
  name: string;
}

export enum ApproveStatus {
  Draft = 'DRAFT',
  Approved = 'APPROVED',
  Deployed = 'DEPLOYED',
}

export interface ApproveAccount {
  id: string;
  name: string;
}

export interface Approve {
  account: ApproveAccount;
  end: string;
  entity: AccountEntity;
  refunds: Refund[];
  start: string;
  status: ApproveStatus;
}

export enum StatisticValue {
  Disqualified = 'disqualified',
  InProgress = 'inProgress',
  Qualified = 'qualified',
}

export interface DvrStatistics {
  currency: string;
  [StatisticValue.Disqualified]: number;
  [StatisticValue.InProgress]: number;
  [StatisticValue.Qualified]: number;
}

export interface RangeValue {
  end: string;
  start: string;
}

export interface Refund {
  children?: Refund[];
  comment?: string;
  country: string;
  details: RefundDetails;
  disable: boolean;
  id?: string;
  name: string;
}

export interface RefundDetails {
  amount: number;
  count: number;
  images: ImaginaryItem[];
}

export interface GroupedRefunds {
  [country: string]: Refund[];
}

export interface RefundsRequest {
  accountId: number;
  entityId: string;
  params: {
    amountFrom?: string;
    amountTo?: string;
    country?: string;
    end?: string; // ISO format "YYYY-MM" (e.g. 2018-10)
    start?: string; // ISO format "YYYY-MM" (e.g. 2018-02)
  };
}

export interface Draft {
  accountId: number;
  email: string;
  end: string; // ISO format "YYYY-MM" (e.g. 2018-10)
  entityId: string;
  refunds: DraftRefund[];
  start: string; // ISO format "YYYY-MM" (e.g. 2018-02)
}

export interface DraftRefund {
  children: DraftChildRefund[];
  comment?: string;
  country: string;
  name: string;
}

export interface DraftChildRefund {
  comment?: string;
  name: string;
}

export interface CreateDraftResponse {
  hash: string;
}

export interface IsUpdatedEntities {
  [entityId: string]: boolean;
}

export interface ImaginaryItem {
  isPdfOrTiff: boolean;
  imaginaryId: string;
  currentPage?: number;
}

export interface IsDisabledEntities extends IsUpdatedEntities {}
