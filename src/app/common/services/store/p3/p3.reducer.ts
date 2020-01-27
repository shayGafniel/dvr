import {
  LoadWorkloadPriorities,
  WorkloadPrioritiesActions,
} from '../../../contracts/workload-priorities/workload-priorities.actions';
import { WorkloadPriority } from '../../../models/work-dispatcher.model';

export const group = 'P3';

export interface State {
  workloadPriorities: WorkloadPriority[];
}

export const initialState: State = {
  workloadPriorities: [],
};

export function reducer(state = initialState, action: WorkloadPrioritiesActions): State {
  if (action instanceof LoadWorkloadPriorities && action.group === group) {
    return { ...state, ...action.payload };
  }

  return state;
}

export const selectWorkloadPriorities = (state: State): WorkloadPriority[] =>
  state.workloadPriorities;
