import { Params, RouterStateSnapshot } from '@angular/router';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';

import { DataOfPath } from '../../models/routing.model';

export class RouterStateUrl {
  public url: string;
  public params: Params;
  public queryParams: Params;
  public dataOfPaths: DataOfPath[];
}

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}

export class RouterSerializer implements RouterStateSerializer<RouterStateUrl> {
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const dataOfPaths = route.pathFromRoot.map(snapshot => snapshot.data);

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params, query params and data pf paths
    // instead of the entire snapshot
    return Object.assign(new RouterStateUrl(), { url, params, queryParams, dataOfPaths });
  }
}
