import { ReclaimListCountsServer } from '../models/reclaim-list-counts-server';

export const reclaimsListCounts = (): ReclaimListCountsServer => ({
  total: { count: 365, amount: 602610 },
  rejected: { count: 123, amount: 100000 },
  refunded: { count: 124, amount: 238250 },
  pending_approval: { count: 42, amount: 88120 },
});
