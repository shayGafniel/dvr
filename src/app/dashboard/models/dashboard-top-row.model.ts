// *********** TOP ROW ***********

export interface DashboardTopRow {
  annual_te_spend: number;
  spent_by_pulled_data: number;
  te_spent_gap: number;
  out_of_scope: number;
  not_eligible: number;
}

export interface AnnualSpendData {
  amount: number;
  group_id: number;
}

export interface AnnualSpendResponse {
  error: string;
  details: string;
}

export interface DashboardSummaryBlock {
  title: string;
  content: string;
  editType?: TopRowEditTypes;
  isMarkContent?: boolean;
}

export enum TopRowEditTypes {
  NoEdit,
  CurrencyEdit,
  AnnualSpendEdit,
}
