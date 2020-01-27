import { InvoiceListCountsServer } from '../models/invoice-list-counts-server';

export const invoicesListCounts = (): InvoiceListCountsServer => ({
  total: { count: 1456, amount: 602610 },
  disqualified: { count: 123, amount: 100000 },
  pending_submission: { count: 56, amount: 238250 },
  reissued: { count: 124, amount: 88120 },
});
