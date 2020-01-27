import {
  Address,
  Branch,
  Contact,
  ValidateVatIdResponse,
  Vendor,
  VendorResponseData,
} from './vendor-management.model';

export let mock_address_data: (i: number) => Address = i => {
  return {
    city: i % 2 ? 'LA' : 'DO',
    street: i % 2 ? 'hollywood' : 'manchester',
    streetNumber: `30 + ${i}`,
    zipCode: `90210 + ${i}`,
  };
};

export let mock_branch_data: (i: number, key: string) => Branch = (i, key) => {
  return {
    branchId: i,
    branchFormalName: `${key}Branch Name${i}`,
    additionalName: `${key} Additional Name${i}`,
    active: i % 2 ? true : false,
    branchAddress: mock_address_data(i),
  };
};

export let mock_contact_data: (i: number, key: string) => Contact = (i, key) => {
  return {
    contactId: `${key}contact${i}`,
    name: `${key}Contact Name${i}`,
    email: `${key}contact@mail${i}`,
    phoneNumber: `${key}Contact Phone${i}`,
  };
};

export let mock_branch_contact_data: (i: number, key: string) => Contact = (i, key) => {
  return {
    branchId: i,
    contactId: `${key}branch-contact${i}`,
    name: `${key}Contact Name${i}`,
    email: `${key}contact@mail${i}`,
    phoneNumber: `${key}Contact Phone${i}`,
  };
};

export let mock_vendor_response_data: (i: number) => VendorResponseData = i => {
  return {
    vendorId: i,
    formalName: `Vendor${i}`,
    country: i % 2 ? 'IT' : 'US',
    taxId: `5t${i}`,
    vatId: `5v${i}`,
    vendorAddress: mock_address_data(1),
    active: i % 2 ? true : false,
    branches: createBranches(20, `Vendor${i}`),
    contacts: createContacts(4, `Vendor${i}`),
    branchContacts: createBranchContacts(20, `Vendor${i}`),
    viesValid: i % 2 ? true : false,
    lastValidatedByVies: { date: '2019-02-20' },
  };
};

function createBranches(i: number, key: string): Branch[] {
  const branches: Branch[] = [];
  for (let y = 1; y < i + 1; y++) {
    branches.push(mock_branch_data(y, key));
  }
  return branches;
}

function createBranchContacts(i: number, key: string): Contact[] {
  const branchContacts: Contact[] = [];
  for (let y = 1; y < i + 1; y++) {
    branchContacts.push(mock_branch_contact_data(y, key));
  }
  return branchContacts;
}

function createContacts(i: number, key: string): Contact[] {
  const contacts: Contact[] = [];
  for (let y = 1; y < i + 1; y++) {
    contacts.push(mock_contact_data(y, key));
  }
  return contacts;
}

export let mock_vendor_list: () => VendorResponseData[] = () => {
  const vendorsData: VendorResponseData[] = [];
  for (let i = 1; i < 100 + 1; i++) {
    vendorsData.push(mock_vendor_response_data(i));
  }
  return vendorsData;
};

export let mock_valid_vendor_vat_id_data: () => ValidateVatIdResponse = () => {
  return {
    status: 200,
    countryCode: 'at',
    requestDate: '2018-08-21',
    valid: true,
    name: 'Troppmair Wolfgang Josef',
    address: 'Innsbrucker Straße 14/3\nAT-6130 Schwaz',
  };
};

export let mock_valid_vat_id_data: () => ValidateVatIdResponse = () => {
  return {
    status: 200,
    countryCode: 'at',
    requestDate: '2018-08-21',
    valid: true,
    name: 'Troppmair Wolfgang Josef',
    address: 'Innsbrucker Straße 14/3\nAT-6130 Schwaz',
    splittedAddress: mock_address_data(1),
  };
};

export const mock_suppliers_data: () => Vendor[] = () => [
  {
    branchId: 435435,
    country: 'US',
    formalName: 'Joe Toilets',
    taxId: '23673142',
    vatId: '1234567890',
    vendorId: 38491,
    vendorAddress: {
      city: 'Springfield',
      street: 'Evergreen Terrace',
      streetNumber: '742',
    },
  },
  {
    country: 'US',
    formalName: 'Mike Toilets',
    taxId: '6574623',
    vatId: '32623462',
    vendorId: 294092,
    vendorAddress: {
      city: 'Quahog',
      street: 'Spooner Street',
      streetNumber: '31',
    },
  },
  {
    branchId: 435435,
    country: 'US',
    formalName: 'Richard Toilets',
    taxId: '23673142',
    vatId: '1234567890',
    vendorId: 43534,
    vendorAddress: {
      city: 'Springfield',
      street: 'Evergreen Terrace',
      streetNumber: '742',
    },
  },
  {
    country: 'US',
    formalName: 'Fred gifts',
    taxId: '6574623',
    vatId: '32623462',
    vendorId: 537565,
    vendorAddress: {
      city: 'Quahog',
      street: 'Spooner Street',
      streetNumber: '31',
    },
  },
  {
    branchId: 435435,
    country: 'US',
    formalName: 'Michael rooms',
    taxId: '23673142',
    vatId: '1234567890',
    vendorId: 5091437,
    vendorAddress: {
      city: 'Quahog',
      street: 'Spooner Street',
      streetNumber: '31',
    },
  },
  {
    country: 'US',
    formalName: 'Moshe falafel',
    taxId: '6574623',
    vatId: '1234567890',
    vendorId: 986437,
    vendorAddress: {
      city: 'Quahog',
      street: 'Spooner Street',
      streetNumber: '311',
    },
  },
  {
    branchId: 435435,
    country: 'US',
    formalName: 'Avram electric',
    taxId: '65746231',
    vatId: '1234567890',
    vendorId: 4657384,
    vendorAddress: {
      city: 'Springfield',
      street: 'Evergreen Terrace',
      streetNumber: '742',
    },
  },
  {
    country: 'US',
    formalName: 'VatBox VAT',
    taxId: '6574623',
    vatId: '32623462',
    vendorId: 2039485,
    vendorAddress: {
      city: 'Quahog',
      street: 'Spooner Street',
      streetNumber: '31',
    },
  },
];
