import { UserActionTypes, UserDataActions } from './user-data.actions';
import { UserData } from './user-data.model';

export interface State {
  user: UserData;
}

export const initialState: State = {
  user: {},
};

export function reducer(state = initialState, action: UserDataActions): State {
  switch (action.type) {
    case UserActionTypes.LoadUserData:
      return { ...state, user: action.payload };

    case UserActionTypes.SetIsAdmin:
      return {
        ...state,
        user: { ...state.user, company: { ...state.user.company, all_accounts: action.isAdmin } },
      };

    default:
      return state;
  }
}

export const selectUser = (state: State): UserData => state.user;

export const selectUserEmail = (state: State): string => {
  const user = selectUser(state);

  return user ? user.email : '';
};

export const selectIsAdmin = (state: State): boolean =>
  state.user.company ? state.user.company.all_accounts : null;
