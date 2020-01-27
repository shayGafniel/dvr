import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { DeadcartApiService } from '../api/deadcart-api.service';
import { BulkCompaniesInfo } from '../../../models/deadcart.model';
import { AppState } from '../../../store/reducers';
import * as fromDeadcartActions from '../../store/deadcart/deadcart.actions';
import { State } from '../../store/reducers';

@Injectable()
export class DeadcartStoreService {
  constructor(private api: DeadcartApiService, private store: Store<AppState & State>) {}

  public requireBulkCompaniesInfo(companiesIds: string[]): Observable<any> {
    return of(null).pipe(
      tap(() => this.store.dispatch(new fromDeadcartActions.GetBulkCompaniesInfo())),
      switchMap(() => this.api.getBulkCompaniesInfo(companiesIds)),
      tap(
        (bulkCompaniesInfo: BulkCompaniesInfo) => {
          this.store.dispatch(new fromDeadcartActions.GetBulkCompaniesInfoSuccess());
          this.store.dispatch(new fromDeadcartActions.LoadBulkCompaniesInfo({ bulkCompaniesInfo }));
        },
        error => this.store.dispatch(new fromDeadcartActions.GetBulkCompaniesInfoFail(error)),
      ),
    );
  }
}
