import { ServerResponse } from '../contracts/base-api';

export enum AssignableType {
  All = '~ALL',
  In = '~IN',
  None = '~NONE',
}

export type AssignableEntry =
  | {
      [item: string]: string[];
    }
  | string;

export interface Assignables {
  accounts: AssignableEntry;
  labels: AssignableEntry;
  modules: AssignableEntry;
  roles: AssignableEntry;
}

export const isFilledAssignables = (assignables: Assignables): boolean => {
  return assignables.modules instanceof Object || typeof assignables.modules === 'string';
};

export interface AssignableRolesForModule {
  [moduleName: string]: string[];
}

export interface Role {
  allowedActions: string[];
  modules: string[];
  name: string;
}

// Portal; permission this api should be deleted when the server create a more declarative api
interface ResourceAction {
  resource: string;
  action: string;
}

interface FilterMap {
  kind: string;
  accounts: string[];
}

export interface AllowedAction {
  service: string;
  resourceAction: ResourceAction;
}

export interface ServiceEnrichment {
  allowedActions: AllowedAction[];
  deniedActions: any[];
  filter: FilterMap;
}

export interface ServiceEnrichmentResponse extends ServerResponse {
  serviceEnrichment: ServiceEnrichment;
}
