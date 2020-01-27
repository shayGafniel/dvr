import { MatIcon } from '@angular/material';
import { ValidatorFn } from '@angular/forms';

export enum TableCellTypes {
  input,
  date,
  select,
  country,
  currecny,
  checkbox,
  icon,
}
export type HeaderName = string; // Table header name
export type ColumnValue = any;

export interface Column {
  type: TableCellTypes;
  isRequired: boolean;
  isEditable: boolean;
  defaultValue?: any;
  icon?: MatIcon;
  validators?: ValidatorFn[];
  placeholder?: string;
  serverKeyName?: string; // The key name as set in the rest api
}

export interface AutoCompleteConf {
  rows?: Row[];
  placeholder: string;
  uniqueKeyName: string;
  keyNameToSearch: string;
}

export interface Row {
  [headerName: string]: ColumnValue;
}

export interface TableConf {
  headersOrder: HeaderName[];
  columnsConf?: { [headerName: string]: Column };
  rows?: Row[];
  isNewEntryRow?: boolean;
  autocompleteConf?: AutoCompleteConf;
}
