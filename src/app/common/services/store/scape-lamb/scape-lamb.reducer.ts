import { WorkloadsNames } from '../../../models/scape-lamb.model';
import { ScapeLambActions, ScapeLambActionTypes } from './scape-lamb.actions';
import { ScapeLambHelper } from '../../../utils/scape-lamb.helper';

export interface State {
  workloadsNames: WorkloadsNames;
}

export const initialState: State = {
  workloadsNames: {},
};

export function reducer(state = initialState, action: ScapeLambActions): State {
  switch (action.type) {
    case ScapeLambActionTypes.LoadWorkloadsNames:
      return {
        ...state,
        workloadsNames: ScapeLambHelper.generateWorkloadsNames(
          action.payload.ids,
          action.payload.names,
        ),
      };

    default:
      return state;
  }
}

export const selectWorkloadsNames = (state: State, ids: string[]): WorkloadsNames => {
  return Object.entries(state.workloadsNames)
    .filter(([id]) => ids.includes(id))
    .reduce((workloadNames: WorkloadsNames, [id, name]) => ({ ...workloadNames, [id]: name }), {});
};
