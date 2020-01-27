import { Permission } from 'app/common/models/user-management.model';
import { PermissionActions } from 'app/auth/store/permission/permission.actions';

export const group = 'Permission';

export interface State {
  permission: Permission[];
}

export const initialState: State = {
  permission: []
};

export function reducer(state = initialState, action: PermissionActions): State {
      return action.payload;
}
