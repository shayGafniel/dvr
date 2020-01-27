import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { StoreService } from '~/auth/store/store.service';
import { ACCOUNT_PREFIX_IN_URL } from '~/app.component';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(public router: Router, public storeService: StoreService) {}

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    const roleName = route.data.serviceName.replace(' ', '');
    const isAuthorized = this.storeService.isRoleAuthorized(roleName);
    if (!isAuthorized) {
      let baseUrl = '';
      try {
        baseUrl = `${ACCOUNT_PREFIX_IN_URL}/${route.params.accId}`;
      } catch (e) {}
      this.router.navigate([baseUrl]);
    }
    return isAuthorized;
  }
}
