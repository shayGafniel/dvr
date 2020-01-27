export interface DispatcherEntity {
  accountType?: string;
  companyCountry?: string;
  companyName?: string;
  companyType?: string;
  entityId: string;
  index?: number;
  inProgress?: number;
  isCompanyActive?: boolean;
  isCompanyDomestic?: boolean;
  stage?: string;
}

export const getMinimalDispatcherEntity = (
  entityId: string,
  inProgress: number,
): DispatcherEntity => ({
  entityId,
  inProgress,
});

export interface DispatcherWorkload {
  active?: boolean;
  companyIds: WorkloadCompanyId[];
  entities: DispatcherEntity[];
  index?: number;
  neverPrioritized: boolean;
  sumOfItemsLeft: number;
  workloadId: string;
  workloadName: string;
}

export interface DispatcherEntities {
  [id: string]: DispatcherEntity;
}

export interface WorkloadPrioritiesResponse {
  workloads: WorkloadPriority[];
  station?: string;
}

export interface WorkloadPriority {
  active: boolean;
  companyIds: WorkloadCompanyId[];
  workloadId: string;
}

export interface WorkloadCompanyId {
  companyId: string;
  evidencesLeft?: number;
  invoicesLeft?: number;
}

export interface WorkEntity {
  companyId: string;
  inProgress: number;
}

export enum ListType {
  Cropping = 'Cropping',
  Expedite = 'Expedite',
  Matcher = 'Matcher',
  P1 = 'P1',
  P2 = 'P2',
  P2Expert = 'P2Expert',
  P3 = 'P3',
  WorkloadManagement = 'WorkloadManagement',
}

export interface SortDispatcherEntitiesPayload {
  entitiesIds: string[];
  workloadId: string;
}
