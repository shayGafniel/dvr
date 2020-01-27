export interface InvoiceListCountsServer {
  total: {
    count: number;
    amount: number;
  };
  disqualified: {
    count: number;
    amount: number;
  };
  pending_submission: {
    count: number;
    amount: number;
  };
  reissued: {
    count: number;
    amount: number;
  };
  opts?: {
    converted_by_server: boolean;
    requested_currency: string;
    currency: string;
  };
}
