import { omit } from 'lodash-es';
import * as moment from 'moment';
import { unbox } from 'ngrx-forms';

import { Country, SimplifiedCountry } from '../../common/services/configuration/configuration.model';
import { DvrHelper } from './dvr.helper';
import { CasesFilter } from '../models/case.model';
import { Draft, DraftRefund, Refund, RefundsRequest } from '../models/dvr.model';
import { GroupedRefundNodes, RefundFlatNode } from '../models/refund.model';
import { MainFiltersUtil } from '../../shared/utils/main-filters.util';
import { CasesFilterFormValue } from '../store/cases-filter-form/cases-filter-form.state';
import { casesFilterFormValue } from '../store/cases-filter-form/cases-filter-form.reducer.spec';
import { refundComments } from '../store/comment-form/comment-form.reducer.spec';
import { end, start } from '../store/date-range-form/date-range-form.reducer.spec';
import {
  accountId,
  countryCode as country,
  countryCodeTwo,
  entityId,
} from '../store/dvr/dvr.reducer.spec';
import { CountryAggregate } from '../store/dvr/dvr.state';

const disable = false;
const ids = ['42', '2', '3', '4'];
const names = ['42', '2', '3', '4'];
export const customRefunds: Refund[] = [
  {
    children: [
      { country, details: null, id: ids[1], disable, name: names[1] },
      { country, details: null, id: ids[2], disable, name: names[2] },
    ],
    country,
    details: null,
    id: ids[0],
    disable,
    name: names[0],
  },
  { country: countryCodeTwo, details: null, id: ids[3], disable, name: names[3] },
];
export const customFlatNodes: RefundFlatNode[] = [
  Object.assign(new RefundFlatNode(), {
    expandable: true,
    item: names[0],
    level: 0,
    refund: customRefunds[0],
    parent: null,
  }),
  Object.assign(new RefundFlatNode(), {
    expandable: false,
    item: names[1],
    level: 1,
    refund: customRefunds[0].children[0],
    parent: null,
  }),
  Object.assign(new RefundFlatNode(), {
    expandable: false,
    item: names[2],
    level: 1,
    refund: customRefunds[0].children[1],
    parent: null,
  }),
  Object.assign(new RefundFlatNode(), {
    expandable: false,
    item: names[3],
    level: 0,
    refund: customRefunds[1],
    parent: null,
  }),
];
export const customDraftRefunds: DraftRefund[] = [
  {
    name: customFlatNodes[0].refund.name,
    comment: refundComments[customFlatNodes[0].refund.id],
    country,
    children: [
      {
        name: customFlatNodes[1].refund.name,
        comment: refundComments[customFlatNodes[1].refund.id],
      },
      {
        name: customFlatNodes[2].refund.name,
        comment: refundComments[customFlatNodes[2].refund.id],
      },
    ],
  },
  {
    name: customFlatNodes[3].refund.name,
    comment: refundComments[customFlatNodes[3].refund.id],
    country: countryCodeTwo,
    children: [],
  },
];
const customCountryAggregate: CountryAggregate = {
  [country]: {
    refundNodes: [],
    refunds: [customRefunds[0]],
    selectedFlatNodes: [customFlatNodes[0], customFlatNodes[1], customFlatNodes[2]],
  },
  [countryCodeTwo]: {
    refundNodes: [],
    refunds: [customRefunds[1]],
    selectedFlatNodes: [customFlatNodes[3]],
  },
};
const customGroupedRefundNodes: GroupedRefundNodes = {
  [country]: [
    {
      item: customRefunds[0].name,
      refund: customRefunds[0],
      parent: null,
      children: [
        {
          item: customRefunds[0].children[0].name,
          refund: customRefunds[0].children[0],
          children: null,
          parent: customRefunds[0].name,
        },
        {
          item: customRefunds[0].children[1].name,
          refund: customRefunds[0].children[1],
          children: null,
          parent: customRefunds[0].name,
        },
      ],
    },
  ],
  [countryCodeTwo]: [
    {
      item: customRefunds[1].name,
      refund: customRefunds[1],
      children: null,
      parent: null,
    },
  ],
};

const draftRefund: DraftRefund = customDraftRefunds[1];
const validDrafts: Draft[] = [
  { accountId, email: '1@1', end, entityId, refunds: [draftRefund], start },
  {
    accountId,
    email: '1@1',
    end,
    entityId,
    refunds: [draftRefund, draftRefund],
    start,
  },
];
const invalidDrafts: Draft[] = [
  { accountId, email: '1@1', end, entityId, refunds: [], start }, // empty refunds
  { accountId, email: '1@1', end, entityId, refunds: [], start }, // empty refunds
  { accountId, email: '', end, entityId, refunds: [draftRefund], start }, // empty email
  {} as any,
  null as any,
];

const invalidDates = ['10-2018', '2018-8', '2018-10-08T09:01:33.652Z', '2018-13', '2118-10'];
const validDates = ['2018-10', '2018-08'];

const invalidRanges = [
  { end: invalidDates[0], start: validDates[1] },
  { end: validDates[0], start: invalidDates[1] },
  { end: invalidDates[2], start: invalidDates[3] },
];
const validRanges = [{ end: validDates[0], start: validDates[1] }, { end: '', start: '' }];

const casesFilter: CasesFilter = {
  id: casesFilterFormValue.id,
  start: DvrHelper.getFormattedDate(MainFiltersUtil.getFromDate(casesFilterFormValue.timeFrame)),
  end: DvrHelper.getFormattedDate(moment().add(1, 'M')),
  entityIds: unbox(casesFilterFormValue.entities),
  status: casesFilterFormValue.status,
};

describe('DvrHelper', () => {
  describe('addIdToRefunds', () => {
    it('should return refunds with filled id field', () => {
      const url = 'some/url';
      const refunds: Refund[] = [
        {
          children: [{ country, details: null, disable, name: names[1] }],
          country,
          details: null,
          disable,
          name: names[0],
        },
        { country, details: null, disable, name: names[2] },
      ];

      const result = DvrHelper.addIdToRefunds(refunds, url);

      expect(result[0].id).toBeTruthy();
      expect(result[0].children[0].id).toBeTruthy();
      expect(result[1].id).toBeTruthy();
    });
  });

  describe('convertCasesFilterFormValue', () => {
    it('should return CasesFilter from CasesFilterFormValue', () => {
      expect(DvrHelper.convertCasesFilterFormValue(casesFilterFormValue)).toEqual(casesFilter);
    });

    it('should return object without null values', () => {
      const formValue: CasesFilterFormValue = { ...casesFilterFormValue, status: null };
      const expected: CasesFilter = omit(casesFilter, ['status']);

      expect(DvrHelper.convertCasesFilterFormValue(formValue)).toEqual(expected);
    });
  });

  describe('countriesToSimplifiedCountries', () => {
    it('should return simplified countries from countries', () => {
      const countries: Country[] = [
        {
          code: 'BG',
          name: 'Bulgaria',
          currencyCode: 'BGN',
          icon: { png: '' },
        },
        {
          code: 'CY',
          name: 'Cyprus',
          currencyCode: 'EUR',
          icon: { png: '' },
        },
      ];
      const simplifiedCountries: SimplifiedCountry[] = [
        {
          code: 'BG',
          name: 'Bulgaria',
        },
        {
          code: 'CY',
          name: 'Cyprus',
        },
      ];

      expect(DvrHelper.countriesToSimplifiedCountries(countries)).toEqual(simplifiedCountries);
    });
  });

  describe('filterSupportedCountries', () => {
    it('should return filtered countries by supported field', () => {
      const countries: Country[] = [
        {
          code: 'BG',
          name: 'Bulgaria',
          currencyCode: 'BGN',
          icon: { png: '' },
          supported: 'supported',
        },
        {
          code: 'CY',
          name: 'Cyprus',
          currencyCode: 'EUR',
          icon: { png: '' },
          supported: 'notSupported',
        },
      ];
      const filteredCountries: Country[] = [countries[0]];

      expect(DvrHelper.filterSupportedCountries(countries)).toEqual(filteredCountries);
    });
  });

  describe('generateFlatNodesFromRefunds', () => {
    it('should return flat nodes from refunds', () => {
      expect(DvrHelper.generateFlatNodesFromRefunds(customRefunds)).toEqual(customFlatNodes);
    });
  });

  describe('generateGroupedRefunds', () => {
    it('should return GroupedRefunds from CountryAggregate', () => {
      expect(DvrHelper.generateGroupedRefundNodes(customCountryAggregate)).toEqual(
        customGroupedRefundNodes,
      );
    });
  });

  describe('isFilledDraft', () => {
    it('should return true if valid draft', () => {
      validDrafts.forEach(validDraft => {
        expect(DvrHelper.isFilledDraft(validDraft)).toBe(true);
      });
    });

    it('should return false if invalid draft', () => {
      invalidDrafts.forEach(invalidDraft => {
        expect(DvrHelper.isFilledDraft(invalidDraft)).toBe(false);
      });
    });
  });

  describe('isValidDateFormat', () => {
    it('should return true if valid date', () => {
      validDates.forEach(validDate => {
        expect(DvrHelper.isValidDateFormat(validDate)).toBe(
          true,
          `"${validDate}" should have valid format`,
        );
      });
    });

    it('should return false if invalid date', () => {
      invalidDates.forEach(invalidDate => {
        expect(DvrHelper.isValidDateFormat(invalidDate)).toBe(
          false,
          `"${invalidDate}" should have invalid format`,
        );
      });
    });
  });

  describe('getEmptyDateRange', () => {
    it('should return new objects', () => {
      const obj1 = DvrHelper.getEmptyDateRange();
      const obj2 = DvrHelper.getEmptyDateRange();

      expect(obj1).not.toBe(obj2);
    });
  });

  describe('getPreparedParams', () => {
    it('should return HttpParams object with filled flat fields', () => {
      const params: RefundsRequest['params'] = { country, end, start };

      const expected = `country=${country}&end=${end}&start=${start}`;

      expect(DvrHelper.getPreparedParams(params).toString()).toBe(expected);
    });

    it('should return HttpParams object with filled existed fields', () => {
      const params: RefundsRequest['params'] = { country, start };

      const expected = `country=${country}&start=${start}`;

      expect(DvrHelper.getPreparedParams(params).toString()).toBe(expected);
    });

    it('should return HttpParams object with filled array fields', () => {
      const uniqueIds = ['42', '2', '3'];
      const params: { [key: string]: string | string[] } = { ids: uniqueIds };

      const expected = `ids=${uniqueIds[0]}&ids=${uniqueIds[1]}&ids=${uniqueIds[2]}`;

      expect(DvrHelper.getPreparedParams(params).toString()).toBe(expected);
    });

    it('should ignore duplicated values', () => {
      const duplicatedIds = ['42', '2', '42', '2', '2', '42', '2'];
      const params: { [key: string]: string | string[] } = { ids: duplicatedIds };

      const expected = `ids=${duplicatedIds[0]}&ids=${duplicatedIds[1]}`;

      expect(DvrHelper.getPreparedParams(params).toString()).toBe(expected);
    });
  });

  describe('setIdToRefunds', () => {
    it('should return refunds with filled id field', () => {
      const id = 'some id';
      const idFn = () => id;
      const refunds: Refund[] = [
        {
          children: [{ country, details: null, disable, name: names[1] }],
          country,
          details: null,
          disable,
          name: names[0],
        },
        { country, details: null, disable, name: names[2] },
      ];

      expect(DvrHelper.setIdToRefunds(refunds, idFn)[0].id).toBe(id);
      expect(DvrHelper.setIdToRefunds(refunds, idFn)[0].children[0].id).toBe(id);
      expect(DvrHelper.setIdToRefunds(refunds, idFn)[1].id).toBe(id);
    });
  });

  describe('validateRange', () => {
    it('should do nothing if it has valid dates', () => {
      validRanges.forEach(validRange => {
        expect(DvrHelper.validateRange(validRange)).toBeUndefined();
      });
    });

    it('should throw a Error if it has an invalid date', () => {
      invalidRanges.forEach(invalidRange => {
        expect(() => DvrHelper.validateRange(invalidRange)).toThrowError();
      });
    });
  });
});
