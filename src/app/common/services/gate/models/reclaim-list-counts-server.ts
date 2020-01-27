export interface ReclaimListCountsServer {
  total: {
    count: number;
    amount: number;
  };
  rejected: {
    count: number;
    amount: number;
  };
  refunded: {
    count: number;
    amount: number;
  };
  pending_approval: {
    count: number;
    amount: number;
  };
  pending_submission?: {
    count: number;
    amount: number;
  };
  opts?: {
    converted_by_server: boolean;
    requested_currency: string;
    currency: string;
  };
}
