import { Country } from '../configuration/configuration.model';

export enum VendorActionMode {
  create = 'CREATE',
  update = 'UPDATE',
}

export interface Supplier {
  supplierId: number;
  name: string;
  address: string;
  vatId: string;
  taxId: string;
  country: string;
  addressId?: number;
}

export interface Address {
  city: string;
  street: string;
  streetNumber: string;
  zipCode?: string;
  state?: string;
}

export interface Contact {
  contactId?: string;
  branchId?: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface Branch {
  branchId?: number;
  branchFormalName: string;
  transliteratedName?: string;
  additionalName?: string;
  active: boolean;
  branchAddress: Address;
}

export interface Vendor {
  vendorId?: number;
  branchId?: number; // this is for p1 get suppliers
  formalName: string;
  transliteratedName?: string;
  additionalName?: string;
  country: string;
  taxId: string;
  vatId: string;
  comment?: string;
  active?: boolean;
  vendorAddress: Address;
  branchesCount?: number; // for list view
  viesValid?: boolean;
  lastValidatedByVies?: any; // VendorDate for response and string for request
}

export interface VendorDate {
  date: string;
}

export interface VendorResponseData extends Vendor {
  branches: Branch[];
  contacts: Contact[];
  branchContacts: Contact[];
}

export interface ValidateVatIdResponse {
  status: number;
  countryCode: string;
  requestDate: string;
  valid: boolean;
  name: string;
  address: string;
  splittedAddress?: Address;
}

export interface OrderModel {
  active: string;
  direction: string;
}

export interface VendorConfig {
  countries: Country[];
}

// Filter
export interface FilterInputForm {
  term: string;
  offset: number;
}
