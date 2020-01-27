export interface SummaryCounts {
  [blockName: string]: SummaryCountsBlock;
}

export interface SummaryCountsBlock {
  count: number;
  amount: number;
}

export interface SummaryStatic {
  [blockName: string]: SummaryStaticBlock;
}

export interface SummaryStaticBlock {
  icon: string;
  iconClass: string;
  label: string;
  scope?: string;
}
