import { ApproveActions, ApproveActionTypes } from './approve.actions';
import { ApproveHelper } from '../../helpers/approve.helper';
import { Approve, ApproveStatus } from '../../models/dvr.model';
import { RefundEntity } from '../../models/refund.model';

export interface State {
  approveHash: string;
  approves: {
    [hash: string]: Approve;
  };
}

export const initialState: State = {
  approveHash: '',
  approves: {},
};

export function reducer(state = initialState, action: ApproveActions): State {
  switch (action.type) {
    case ApproveActionTypes.LoadApprove:
      return {
        ...state,
        approves: { ...state.approves, [action.payload.approveHash]: action.payload.approve },
      };

    case ApproveActionTypes.SetApproveHash:
      return { ...state, ...action.payload };

    case ApproveActionTypes.UpdateApprove:
      const approveHash = action.payload.approveHash;

      return {
        ...state,
        approves: {
          ...state.approves,
          [approveHash]: {
            ...state.approves[approveHash],
            ...action.payload.approve,
          },
        },
      };

    default:
      return state;
  }
}

export const selectApprove = (state: State): Approve => state.approves[state.approveHash] || null;

export const selectApproveEntities = (state: State): RefundEntity[] => {
  const approve = selectApprove(state);

  if (!approve) {
    return [];
  }

  return [{ id: approve.entity.id, isUpdated: false, name: approve.entity.name }];
};

export const selectApproveHash = (state: State): string => state.approveHash;

export const selectCanDoApprove = (state: State): boolean => {
  const approve = selectApprove(state);

  if (!approve) {
    return null;
  }

  return ApproveHelper.isAbleToApproveStatus(approve.status);
};

export const selectStatus = (state: State): ApproveStatus => {
  const approve = selectApprove(state);

  if (!approve) {
    return null;
  }

  return approve.status;
};
