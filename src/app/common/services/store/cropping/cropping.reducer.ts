import {
  LoadWorkEntities,
  WorkEntitiesActions,
} from '../../../contracts/work-entities/work-entities.actions';
import { WorkEntity } from '../../../models/work-dispatcher.model';

export const group = 'Cropping';

export interface State {
  workEntities: WorkEntity[];
}

export const initialState: State = {
  workEntities: [],
};

export function reducer(state = initialState, action: WorkEntitiesActions): State {
  if (action instanceof LoadWorkEntities && action.group === group) {
    return { ...state, ...action.payload };
  }

  return state;
}

export const selectWorkEntities = (state: State): WorkEntity[] => state.workEntities;
