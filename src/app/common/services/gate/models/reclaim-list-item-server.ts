export interface ReclaimListItemServer {
  id: number;
  account?: string;
  currency: string;
  expected_refund_at?: string;
  country: string;
  reclaim_period?: {
    start_date?: string;
    end_date?: string;
  };
  claim_vat_amount: string;
  actual_refund_amount?: string;
  directive_type?: string;
  status: string;
  uploads?: Array<string>;
}
