import { approveStatusTitleMap } from './case.model';
import { ApproveStatus } from './dvr.model';
import {
  SummaryCounts,
  SummaryCountsBlock,
  SummaryStatic,
  SummaryStaticBlock,
} from '../../shared/models/summary-line.model';

export enum SummaryCountsType {
  Total = 'total',
  Approved = 'approved',
  Draft = 'draft',
}

export interface CasesListCounts extends SummaryCounts {
  [SummaryCountsType.Approved]: SummaryCountsBlock;
  [SummaryCountsType.Draft]: SummaryCountsBlock;
  [SummaryCountsType.Total]: SummaryCountsBlock;
}

export interface CasesListCountsStatic extends SummaryStatic {
  [SummaryCountsType.Approved]: SummaryStaticBlock;
  [SummaryCountsType.Draft]: SummaryStaticBlock;
  [SummaryCountsType.Total]: SummaryStaticBlock;
}

export const casesListCountsOrder: SummaryCountsType[] = [
  SummaryCountsType.Total,
  SummaryCountsType.Draft,
  SummaryCountsType.Approved,
];

export const casesListCountsStatic: CasesListCountsStatic = {
  approved: {
    icon: 'approved',
    iconClass: 'color-ok',
    label: approveStatusTitleMap[ApproveStatus.Approved],
    scope: ApproveStatus.Approved,
  },
  draft: {
    icon: 'pending_approval',
    iconClass: 'color-alert',
    label: approveStatusTitleMap[ApproveStatus.Draft],
    scope: ApproveStatus.Draft,
  },
  total: {
    icon: 'page',
    iconClass: '',
    label: 'Total',
    scope: '',
  },
};
