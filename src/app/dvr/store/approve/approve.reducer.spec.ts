import * as fromActions from './approve.actions';
import {
  initialState,
  reducer,
  selectApprove,
  selectApproveEntities,
  selectApproveHash,
  selectCanDoApprove,
  selectStatus,
  State,
} from './approve.reducer';
import { end, start } from '../date-range-form/date-range-form.reducer.spec';
import { account as dvrAccount, entities, refunds } from '../dvr/dvr.reducer.spec';
import { AccountEntity, Approve, ApproveAccount, ApproveStatus } from '../../models/dvr.model';
import { RefundEntity } from '../../models/refund.model';

const entity: AccountEntity = entities[0];
export const status = ApproveStatus.Draft;
export const account: ApproveAccount = {
  id: dvrAccount.accountId.toString(),
  name: dvrAccount.accountName,
};
export const approve: Approve = {
  account,
  end,
  entity,
  refunds,
  start,
  status,
};
export const approveHash = 'some approve hash';

export const stateWithApproveHash = reducer(
  initialState,
  new fromActions.SetApproveHash({ approveHash }),
);
export const stateWithApprove = reducer(
  stateWithApproveHash,
  new fromActions.LoadApprove({ approve, approveHash }),
);

function getStateWithStatus(approveStatus: ApproveStatus): State {
  return reducer(
    stateWithApprove,
    new fromActions.UpdateApprove({
      approve: { ...approve, status: approveStatus },
      approveHash,
    }),
  );
}

describe('Approve Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('LoadApprove', () => {
    it('should fill the approves field with approve', () => {
      const action = new fromActions.LoadApprove({ approve, approveHash });

      const result = reducer(initialState, action);
      const approves = { [approveHash]: approve };

      expect(result).toEqual({ ...initialState, approves });
    });
  });

  describe('SetApproveHash', () => {
    it('should fill the approveHash field', () => {
      const action = new fromActions.SetApproveHash({ approveHash });

      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, approveHash });
    });
  });

  describe('UpdateApprove', () => {
    it('should update the approve object', () => {
      const updatedApprove: Approve = { ...approve, status: ApproveStatus.Approved };
      const action = new fromActions.UpdateApprove({ approve: updatedApprove, approveHash });

      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, approves: { [approveHash]: updatedApprove } });
    });
  });

  describe('selectApprove', () => {
    it('should return Approve object by approveHash', () => {
      expect(selectApprove(stateWithApprove)).toEqual(approve);
    });

    it('should return null if no approveHash', () => {
      expect(selectApprove(initialState)).toBe(null);
    });
  });

  describe('selectApproveEntities', () => {
    it('should return refund entities from entity in approve', () => {
      const expected: RefundEntity[] = [
        { id: approve.entity.id, isUpdated: false, name: approve.entity.name },
      ];

      expect(selectApproveEntities(stateWithApprove)).toEqual(expected);
    });

    it('should return empty array if no required data', () => {
      expect(selectApproveEntities(stateWithApproveHash)).toEqual([], 'no approve object');
      expect(selectApproveEntities(initialState)).toEqual([], 'no approveHash');
    });
  });

  describe('selectApproveHash', () => {
    it('should return the approveHash field', () => {
      expect(selectApproveHash(stateWithApproveHash)).toEqual(approveHash);
    });
  });

  describe('selectCanDoApprove', () => {
    it('should return true with default approve', () => {
      expect(selectCanDoApprove(stateWithApprove)).toBe(true);
    });

    it('should return false with updated status', () => {
      expect(selectCanDoApprove(getStateWithStatus(ApproveStatus.Approved))).toBe(false);
      expect(selectCanDoApprove(getStateWithStatus(ApproveStatus.Deployed))).toBe(false);
    });

    it('should return null if no required data', () => {
      expect(selectCanDoApprove(stateWithApproveHash)).toBe(null, 'no approve object');
      expect(selectCanDoApprove(initialState)).toBe(null, 'no approveHash');
    });
  });

  describe('selectStatus', () => {
    it('should return the default status', () => {
      expect(selectStatus(stateWithApprove)).toBe(ApproveStatus.Draft);
    });

    it('should return a custom status', () => {
      expect(selectStatus(getStateWithStatus(ApproveStatus.Approved))).toBe(ApproveStatus.Approved);
      expect(selectStatus(getStateWithStatus(ApproveStatus.Deployed))).toBe(ApproveStatus.Deployed);
    });

    it('should return false if no required data', () => {
      expect(selectStatus(stateWithApproveHash)).toBe(null, 'no approve object');
      expect(selectStatus(initialState)).toBe(null, 'no approveHash');
    });
  });
});
