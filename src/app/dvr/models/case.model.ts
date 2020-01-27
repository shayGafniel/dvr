import { AccountEntity, ApproveStatus } from './dvr.model';

export interface Case {
  approvedBy: string;
  caseId: number;
  countries: string[];
  createdAt: string;
  createdBy: string;
  entityName: string;
  hash: string;
  potentialVatAmount: number;
  status: ApproveStatus;
}

export interface CaseStatisticsItem {
  amount: number;
  count: number;
}

export enum CaseStatisticsType {
  Approved = 'approved',
  Draft = 'draft',
}

export const approveStatusColorMap = {
  [ApproveStatus.Approved]: '#2ac440',
  [ApproveStatus.Draft]: '#fbaa41',
};

export const approveStatusTitleMap = {
  [ApproveStatus.Approved]: 'Approved',
  [ApproveStatus.Draft]: 'Pending approval',
};

export interface CaseStatistics {
  [CaseStatisticsType.Approved]: CaseStatisticsItem;
  [CaseStatisticsType.Draft]: CaseStatisticsItem;
}

export interface CasesResponse {
  cases: Case[];
  statistics: CaseStatistics;
}

export const entityAllValueId = 'all';
export const getEntityAllValue = (): AccountEntity => ({
  countries: [],
  id: entityAllValueId,
  name: 'All',
});

export interface CasesFilter {
  id?: string;
  start?: string;
  end?: string;
  entityIds?: string[];
  status?: ApproveStatus;
}
