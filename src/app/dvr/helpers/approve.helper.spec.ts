import { ApproveHelper } from './approve.helper';
import { AccountEntity, Approve, ApproveStatus, GroupedRefunds, Refund } from '../models/dvr.model';
import { DvrMock } from '../services/dvr-api/dvr.mock';
import { account, status } from '../store/approve/approve.reducer.spec';
import { end, start } from '../store/date-range-form/date-range-form.reducer.spec';
import { entities, refunds } from '../store/dvr/dvr.reducer.spec';

export const groupedRefunds: GroupedRefunds = DvrMock.countries.reduce((groups, country) => {
  return { ...groups, [country]: refunds.filter(refund => refund.country === country) };
}, {});

const entity: AccountEntity = entities[0];
const disable = false;

const ableToApproveStatuses: ApproveStatus[] = [ApproveStatus.Draft];
const notAbleToApproveStatuses: ApproveStatus[] = [
  ApproveStatus.Approved,
  ApproveStatus.Deployed,
  null,
];

const filledApproves: Approve[] = [
  { account, end, entity, refunds: [refunds[0]], start, status },
  {
    account,
    end,
    entity,
    refunds: [refunds[0], refunds[1]],
    start,
    status,
  },
];
export const notFilledApproves: Approve[] = [
  { account, end, entity, refunds: [], start, status },
  { account, end, entity, refunds: null, start, status },
];

describe('ApproveHelper', () => {
  describe('generateGroupedRefunds', () => {
    it('should return GroupedRefunds from mock refunds', () => {
      expect(ApproveHelper.generateGroupedRefunds(refunds)).toEqual(groupedRefunds);
    });

    it('should return GroupedRefunds from custom refunds', () => {
      const countries = ['GB', 'FR'];
      const customRefunds: Refund[] = [
        { country: countries[0], details: null, id: 'id1', disable, name: '' },
        { country: countries[1], details: null, id: 'id2', disable, name: '' },
      ];

      const expected: GroupedRefunds = {
        [countries[0]]: [customRefunds[0]],
        [countries[1]]: [customRefunds[1]],
      };

      expect(ApproveHelper.generateGroupedRefunds(customRefunds)).toEqual(expected);
    });
  });

  describe('isAbleToApproveStatus', () => {
    it('should return true if status is able to approve', () => {
      ableToApproveStatuses.forEach(approveStatus => {
        expect(ApproveHelper.isAbleToApproveStatus(approveStatus)).toBe(true);
      });
    });

    it('should return false if status is not able to approve', () => {
      notAbleToApproveStatuses.forEach(approveStatus => {
        expect(ApproveHelper.isAbleToApproveStatus(approveStatus)).toBe(false);
      });
    });
  });

  describe('isFilledRefunds', () => {
    it('should return true if approve has filled refunds', () => {
      filledApproves.forEach(filledApprove => {
        expect(ApproveHelper.isFilledRefunds(filledApprove)).toBe(true);
      });
    });

    it('should return false if approve does not have filled refunds', () => {
      notFilledApproves.forEach(notFilledApprove => {
        expect(ApproveHelper.isFilledRefunds(notFilledApprove)).toBe(false);
      });
    });
  });
});
