import { ReclaimListItemServer } from './reclaim-list-item-server';

export interface ReclaimListServerResponse {
  reclaims: ReclaimListItemServer[];
  page: number;
}
