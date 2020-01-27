import { Assignables } from './permissions.model';

export interface Group {
  _id?: string;
  accountId: string;
  extra?: {
    modules: string[];
    roles: string[];
    superGroupsIds: string[];
    usersIds: string[];
  };
  label?: string;
  name: string;
}

export enum UserSkillType {
  Country = 'Country',
  Station = 'Station',
}

export interface UserSkill {
  type: UserSkillType;
  values: string[];
}

export interface Skilled {
  skills: UserSkill[];
}

export const defaultStationsSkillValue = 'Regular';

export interface User extends Partial<Skilled> {
  _id: string;
  accountId: string;
  active?: boolean;
  countriesOfSkill?: string[];
  email: string;
  extra?: {
    modules: string[];
    roles: string[];
    superGroupsIds: string[];
  };
  firstName: string;
  label: string;
  lastName: string;
  skills?: UserSkill[];
  stationsOfSkill?: string[];
}

export interface NewUser extends Partial<User> {
  _id?: string;
}

export interface UpdatingUser extends Partial<Skilled> {
  accountId: string;
  countriesOfSkill?: string[];
  firstName: string;
  label: string;
  lastName: string;
  skills?: UserSkill[];
  stationsOfSkill?: string[];
}

export interface BulkOfUsers {
  found: User[];
  notFound?: string[];
}

export interface PaginationConfigFilter {
  fts: string;
  ids?: string[];
}

export interface UserListFilter extends PaginationConfigFilter {
  accounts?: string[];
  labels?: string[];
  skilledCountries?: string[];
  skilledStations?: string[];
}

export interface PaginationSort {
  field: string;
  ascending: boolean;
}

export interface PaginationConfig<F extends PaginationConfigFilter = PaginationConfigFilter> {
  count: number;
  filter?: F;
  from: number;
  sort?: PaginationSort[];
}

export interface PaginationRecord {
  total: number;
  totalFiltered: number;
}

export interface GroupListPaginationRecord extends PaginationRecord {
  groups: Group[];
}

export interface UserListPaginationRecord extends PaginationRecord {
  users: User[];
}

export enum ActivationStatus {
  Activate = 'activate',
  Deactivate = 'deactivate',
}

export interface UserActivation {
  status: ActivationStatus;
  user: User;
}

export enum InheritedFromType {
  Group = 'Group',
}

export interface InheritedFrom {
  id: string;
  type: InheritedFromType;
}

export const editableModuleName = 'M-UserManagement';

export interface RoleScopeAssignable {
  filtersMap: Assignables;
  model: typeof editableModuleName;
}

export interface RoleScope {
  filtersMap: {};
  model: string;
}

export interface ServerPermission {
  id?: string;
  roles: string[];
  inheritedFrom?: InheritedFrom;
  scopes: RoleScope[] | RoleScopeAssignable[];
}

export interface Permission {
  id: string;
  inheritedFrom?: InheritedFrom;
  moduleName: string;
  roleName: string;
  scope?: RoleScope | RoleScopeAssignable;
}

export interface PermissionsOfGroups {
  inheritedPermissions: string[];
}

export interface PermissionWrite {
  inheritedPermissions?: string[];
  permissions?: ServerPermission[];
}

export interface Label {
  accountId: string;
  name: string;
}

export interface StationSkill {
  displayName: string;
  name: string;
}
