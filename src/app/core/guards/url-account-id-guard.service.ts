import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ACCOUNT_PREFIX_IN_URL } from '~/app.component';
import { AppState } from '~/common/store/reducers';
import { map, take } from 'rxjs/operators';
import { selectAccountId } from '~/core/store/reducers';
import { Observable } from 'rxjs';


@Injectable()
export class CanActivateUrlWithoutAccId implements CanActivate {
  constructor(private router: Router, private store: Store<AppState>) {}

  public canActivate(
    _, // only the second parameter (state) is needed
    state: RouterStateSnapshot
  ): Observable<boolean>|boolean {
    return this.store
      .pipe(
        select(selectAccountId),
        take(1),
        map((account: number) => {
          const accIdPrefix = `/${ACCOUNT_PREFIX_IN_URL}/${account}`;
          this.router.navigate([`${accIdPrefix}${state.url}`]);
          return false;
        }),
      );
  }
}
