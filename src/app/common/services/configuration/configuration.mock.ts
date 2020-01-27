import { ConfigurationTestDataGen } from './conf-test-data.generator';
import { CountryExpert, P2DocumentType, Province } from './configuration.model';

export const mock_documents_types: () => P2DocumentType[] = () => {
  return [
    {
      documentType: 'Invoice',
      documentTypeTextForUi: 'Fattura', // optional
    },
    {
      documentType: 'Information Invoice/ Bill/ Other',
      documentTypeTextForUi: 'Informazioni fattura / Bill / Altro', // optional
    },
  ];
};

export const mock_vat_rates: () => number[] = () => {
  return [700, 1900];
};

export const mock_vat_table = () => {
  return {
    rateByType: [
      {
        expType: 'Hotel',
        rate: 7,
        openedAsDefault: false,
      },
      {
        expType: 'Conferences',
        rate: 7,
        openedAsDefault: false,
      },
      {
        expType: 'Restaurants',
        rate: 19,
        openedAsDefault: true,
      },
    ],
  };
};

export const mock_documents_types_1: () => P2DocumentType[] = () => {
  return [
    {
      documentType: 'Invoice',
      documentTypeTextForUi: 'Invoice/ Facture/ Rechnung',
    },
    {
      documentType: 'Copy of Invoice',
      documentTypeTextForUi: 'Copy of Invoice/ Copie de la facture/ Kopie der Rechnung',
    },
    {
      documentType: 'Credit Card Slip',
      documentTypeTextForUi: 'Credit Card Slip/ Carte de crédit/ Kreditkarten Beleg',
    },
    { documentType: 'Folio', documentTypeTextForUi: 'Folio/ Folio/ Folio' },
    {
      documentType: 'Bill',
      documentTypeTextForUi: 'Bill/ Facture/ Rechnung',
    },
    {
      documentType: 'Booking Confirmation',
      documentTypeTextForUi:
        'Booking Confirmation/ Confirmation de réservation/ Buchungsbestätigung',
    },
    {
      documentType: 'Information Invoice/ Bill',
      documentTypeTextForUi:
        'Information Invoice/ Bill/ Information Facture / Facture / Autre/ Informationen Rechnung / Rechnung / Sonstiges',
    },
    { documentType: 'Receipt', documentTypeTextForUi: 'Receipt/ reçu/ Quittung' },
    {
      documentType: 'Deposit',
      documentTypeTextForUi: 'Deposit/ Dépôt/ Anzahlung',
    },
    {
      documentType: 'Proforma',
      documentTypeTextForUi: 'Proforma/ Proforma/ Proforma',
    },
    { documentType: 'Credit Note', documentTypeTextForUi: 'Credit Note/ Avoir/ Gutschrift' },
  ];
};
export const mock_documents_types_2: () => P2DocumentType[] = () => {
  return [
    { documentType: 'Invoice', documentTypeTextForUi: 'Invoice' },
    {
      documentType: 'Copy of Invoice',
      documentTypeTextForUi: 'Copy of Invoice',
    },
    { documentType: 'Credit Card Slip', documentTypeTextForUi: 'Credit Card Slip' },
    {
      documentType: 'Receipt',
      documentTypeTextForUi: 'Receipt',
    },
    { documentType: 'Restaurant bill', documentTypeTextForUi: 'Restaurant bill' },
    {
      documentType: 'Proforma',
      documentTypeTextForUi: 'Proforma',
    },
  ];
};
export const mock_documents_types_3: () => P2DocumentType[] = () => {
  return [
    { documentType: 'Invoice', documentTypeTextForUi: 'Invoice' },
    {
      documentType: 'Copy of Invoice',
      documentTypeTextForUi: 'Copy of Invoice',
    },
    { documentType: 'Credit Card Slip', documentTypeTextForUi: 'Credit Card Slip' },
    {
      documentType: 'Receipt',
      documentTypeTextForUi: 'Receipt',
    },
    { documentType: 'Restaurant bill', documentTypeTextForUi: 'Restaurant bill' },
    {
      documentType: 'Proforma',
      documentTypeTextForUi: 'Proforma',
    },
  ];
};
export const mock_documents_types_4: () => P2DocumentType[] = () => {
  return [
    { documentType: 'Invoice', documentTypeTextForUi: 'Invoice' },
    {
      documentType: 'Copy of Invoice',
      documentTypeTextForUi: 'Copy of Invoice',
    },
    { documentType: 'Credit Card Slip', documentTypeTextForUi: 'Credit Card Slip' },
    {
      documentType: 'Receipt',
      documentTypeTextForUi: 'Receipt',
    },
    { documentType: 'Restaurant bill', documentTypeTextForUi: 'Restaurant bill' },
    {
      documentType: 'Proforma',
      documentTypeTextForUi: 'Proforma',
    },
  ];
};
export const mock_documents_types_5: () => P2DocumentType[] = () => {
  return [
    { documentType: 'Invoice', documentTypeTextForUi: 'Invoice/ Rechnung' },
    {
      documentType: 'Copy of Invoice',
      documentTypeTextForUi: 'Copy of Invoice/ Kopie der Rechnung',
    },
    {
      documentType: 'Credit Card Slip',
      documentTypeTextForUi: 'Credit Card Slip/ Kreditkarten Beleg',
    },
  ];
};

export const CONFIGURATION_RESPONSE_1 = () => {
  return {
    countries: [
      {
        code: 'GB',
        name: 'United Kingdom',
        currencyCode: 'GBP',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463933969/urw7iyph16fk0pneji4d.png',
        },
        groups: ['EU'],
        supported: 'supported',
      },
      {
        code: 'DE',
        name: 'Germany',
        currencyCode: 'EUR',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463992759/vf3htyzabno3yqzb3cib.png',
        },
        groups: ['EU'],
        supported: 'supported',
      },
      {
        code: 'CH',
        name: 'Switzerland',
        currencyCode: 'CHF',
        icon: {
          png: 'https://s3-eu-west-1.amazonaws.com/vatbox-public/icon/y7lud3lirwaxecfbkfys.png',
        },
        groups: ['Non EU - Popular'],
        supported: 'supported',
      },
      {
        code: 'ES',
        name: 'Spain',
        currencyCode: 'EUR',
        icon: {
          png: 'https://s3-eu-west-1.amazonaws.com/vatbox-public/icon/a20q1a8btbpqxyddx1jd.png',
        },
        groups: ['EU'],
        supported: 'supported',
      },
      {
        code: 'PT',
        name: 'Portugal',
        currencyCode: 'EUR',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463993135/dqoxdupn1bmogikoabxj.png',
        },
        groups: ['EU'],
        supported: 'supported',
      },
      {
        code: 'BG',
        name: 'Bulgaria',
        currencyCode: 'BGN',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463993257/o9yk3zepsyfptcr0eyil.png',
        },
        groups: ['EU'],
        supported: 'supported',
      },
      {
        code: 'FR',
        name: 'France',
        currencyCode: 'EUR',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463993281/bn2p1al4ahcztgxa67c7.png',
        },
        groups: ['EU'],
        supported: 'supported',
      },
      {
        code: 'CY',
        name: 'Cyprus',
        currencyCode: 'EUR',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463993305/gukffsjkfag3njmh6yx1.png',
        },
        groups: ['EU'],
        supported: 'supported',
      },
    ],
    currencies: [{ code: 'GBP', symbol: '£', name: 'British Pound', supported: 'supported' }],
    categories: [
      {
        name: 'Car Rental',
        shortName: 'RENT',
        id: '4',
        icon: { svg: 'http://s.cdpn.io/3/kiwi.svg' },
        supported: 'SUPPORTED',
      },
    ],
    commonCurrencies: [{ code: 'GBP', symbol: '£', name: 'British Pound' }],
    categoryAliases: [
      { name: 'foo', shortName: 'RENT', id: '4', icon: { svg: 'http://s.cdpn.io/3/kiwi.svg' } },
    ],
  };
};

export const CONFIGURATION_RESPONSE_WITH_VAT_STRINGS = () => {
  return {
    countries: [
      {
        code: 'GB',
        name: 'United Kingdom',
        currencyCode: 'GBP',
        icon: {
          png:
            'https://voyage.vatbox.com/bower_components/web-client-common/resources/images/countries/_vn.png',
        },
      },
    ],
    currencies: [{ code: 'GBP', symbol: '£', name: 'British Pound' }],
    categories: [
      {
        name: 'Car Rental',
        shortName: 'RENT',
        id: '4',
        icon: { svg: 'http://s.cdpn.io/3/kiwi.svg' },
        supported: 'SUPPORTED',
      },
    ],
    vatStrings: {
      GB: 'VAT',
      DE: 'MwSt',
      IT: 'IVA',
    },
    commonCurrencies: [{ code: 'GBP', symbol: '£', name: 'British Pound' }],
  };
};

export const mock_vat_rates_1: () => number[] = () => {
  return [1700, 1400, 800, 300];
};
export const mock_vat_rates_2: () => number[] = () => {
  return [2000, 500];
};
export const mock_vat_rates_3: () => number[] = () => {
  return [2000, 500];
};
export const mock_vat_rates_4: () => number[] = () => {
  return [2000, 500];
};
export const mock_vat_rates_5: () => number[] = () => {
  return [1900, 700];
};

export const mock_canada_provinces: () => Province[] = () => {
  return [
    {
      code: 'AB',
      name: 'Alberta',
      concept: 'no pst',
      gstRate: 5,
      taxTypes: ['GST', 'Other'],
    },
    {
      code: 'BC',
      name: 'British Columbia',
      concept: 'pst',
      conceptRate: 7,
      gstRate: 5,
      taxTypes: ['GST', 'PST', 'Other'],
    },
    {
      code: 'MB',
      name: 'Manitoba',
      concept: 'pst',
      conceptRate: 8,
      gstRate: 5,
      taxTypes: ['GST', 'PST', 'Other'],
    },
    {
      code: 'NB',
      name: 'New Brunswick',
      concept: 'hst',
      conceptRate: 15,
      gstRate: 5,
      taxTypes: ['HST', 'Other'],
    },
    {
      code: 'NL',
      name: 'Newfoundland and Labrador',
      concept: 'hst',
      conceptRate: 15,
      gstRate: 5,
      taxTypes: ['HST', 'Other'],
    },
    {
      code: 'NS',
      name: 'Nova Scotia',
      concept: 'hst',
      conceptRate: 15,
      gstRate: 5,
      taxTypes: ['HST', 'Other'],
    },
    {
      code: 'NT',
      name: 'Northwest Territories',
      concept: 'no pst',
      gstRate: 5,
      taxTypes: ['GST', 'Other'],
    },
    {
      code: 'NU',
      name: 'Nunavut',
      concept: 'no pst',
      gstRate: 5,
      taxTypes: ['GST', 'Other'],
    },
    {
      code: 'ON',
      name: 'Ontario',
      concept: 'hst',
      conceptRate: 13,
      gstRate: 5,
      taxTypes: ['HST', 'Other'],
    },
    {
      code: 'PE',
      name: 'Prince Edward Island',
      concept: 'hst',
      conceptRate: 15,
      gstRate: 5,
      taxTypes: ['HST', 'Other'],
    },
    {
      code: 'QC',
      name: 'Quebec',
      concept: 'qst',
      conceptRate: 9.975,
      gstRate: 5,
      taxTypes: ['GST', 'QST', 'Other'],
    },
    {
      code: 'SK',
      name: 'Saskatchewan',
      concept: 'psst',
      conceptRate: 6,
      gstRate: 5,
      taxTypes: ['GST', 'PST', 'Other'],
    },
    {
      code: 'YT',
      name: 'Yukon',
      concept: 'no pst',
      gstRate: 5,
      taxTypes: ['GST', 'Other'],
    },
  ];
};

export const configurationResponse = () => {
  return {
    countries: ConfigurationTestDataGen.countries,
    currencies: ConfigurationTestDataGen.currencies,
    categories: ConfigurationTestDataGen.categories,
    vatStrings: ConfigurationTestDataGen.vatStrings,
    commonCurrencies: ConfigurationTestDataGen.commonCurrencies,
    categoryAliases: ConfigurationTestDataGen.categoryAliases,
    allCountries: ConfigurationTestDataGen.countries,
    allCurrencies: ConfigurationTestDataGen.currencies,
  };
};

export const confSortedAlphabetically = () => {
  return {
    countries: [
      {
        code: 'BG',
        name: 'Bulgaria',
        currencyCode: 'BGN',
        icon: {
          png: 'https://s3-eu-west-1.amazonaws.com/vatbox-public/icon/bng.png',
        },
        groups: ['EU'],
      },
      {
        code: 'CY',
        name: 'Cyprus',
        currencyCode: 'EUR',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463993305/gukffsjkfag3njmh6yx1.png',
        },
        groups: ['EU'],
      },
      {
        code: 'FR',
        name: 'France',
        currencyCode: 'EUR',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463993281/bn2p1al4ahcztgxa67c7.png',
        },
        groups: ['EU'],
      },
      {
        code: 'DE',
        name: 'Germany',
        currencyCode: 'EUR',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463992759/vf3htyzabno3yqzb3cib.png',
        },
        groups: ['EU'],
      },
      {
        code: 'PT',
        name: 'Portugal',
        currencyCode: 'EUR',
        icon: {
          png:
            'https://res.cloudinary.com/vatbox/image/upload/v1463993135/dqoxdupn1bmogikoabxj.png',
        },
        groups: ['EU'],
      },
      {
        code: 'ES',
        name: 'Spain',
        currencyCode: 'EUR',
        icon: {
          png: 'https://s3-eu-west-1.amazonaws.com/vatbox-public/icon/a20q1a8btbpqxyddx1jd.png',
        },
        groups: ['EU'],
      },
      {
        code: 'CH',
        name: 'Switzerland',
        currencyCode: 'CHF',
        icon: {
          png: 'https://s3-eu-west-1.amazonaws.com/vatbox-public/icon/y7lud3lirwaxecfbkfys.png',
        },
        groups: ['Non EU - Popular'],
      },
      {
        code: 'GB',
        name: 'United Kingdom',
        currencyCode: 'GBP',
        icon: {
          png: 'https://s3-eu-west-1.amazonaws.com/vatbox-public/icon/y7lud3lirwaxecfbkfys.png',
        },
        groups: ['EU'],
      },
    ],
    currencies: [{ code: 'GBP', symbol: '£', name: 'British Pound' }],
    categories: [
      {
        name: 'Car Rental',
        shortName: 'RENT',
        id: '4',
        icon: { svg: 'http://s.cdpn.io/3/kiwi.svg' },
      },
    ],
    commonCurrencies: [{ code: 'GBP', symbol: '£', name: 'British Pound' }],
    categoryAliases: [
      {
        name: 'foo',
        shortName: 'RENT',
        id: '4',
        icon: { svg: 'http://s.cdpn.io/3/kiwi.svg' },
      },
    ],
  };
};

export const countriesExpert = (): CountryExpert[] => {
  return [
    {
      code: 'CN',
      icon: {
        png: 'http://res.cloudinary.com/vatbox/image/upload/v1508919985/beqod9pmvhu9a3mxqzz4.png',
      },
      name: 'China',
    },
    {
      code: 'RU',
      icon: {
        png: 'http://res.cloudinary.com/vatbox/image/upload/v1508920008/pafvpaecie21slq8j33j.png',
      },
      name: 'Russian Federation',
    },
  ];
};
