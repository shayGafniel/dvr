import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DeadcartApiService } from '../api/deadcart-api.service';
import { DeadcartStoreService } from './deadcart-store.service';
import { BulkCompaniesInfo } from '../../../models/deadcart.model';
import * as fromActions from '../../store/deadcart/deadcart.actions';
import * as fromDeadcart from '../../store/deadcart/deadcart.reducer';
import { bulkCompaniesInfo, companiesIds } from '../../store/deadcart/deadcart.reducer.spec';

const error = new Error('Test error');

describe('DeadcartStoreService', () => {
  let apiService: DeadcartApiService;
  let service: DeadcartStoreService;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          core: combineReducers({
            deadcart: fromDeadcart.reducer,
          }),
        }),
      ],
      providers: [DeadcartApiService, DeadcartStoreService],
    });
  }));

  beforeEach(() => {
    apiService = TestBed.get(DeadcartApiService);
    service = TestBed.get(DeadcartStoreService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('requireBulkCompaniesInfo', () => {
    it('should dispatch successful actions with data', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetBulkCompaniesInfo()],
        [new fromActions.GetBulkCompaniesInfoSuccess()],
        [new fromActions.LoadBulkCompaniesInfo({ bulkCompaniesInfo })],
      ];

      apiService.getBulkCompaniesInfo = (): Observable<BulkCompaniesInfo> => of(bulkCompaniesInfo);
      service.requireBulkCompaniesInfo(companiesIds).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetBulkCompaniesInfo()],
        [new fromActions.GetBulkCompaniesInfoFail(error)],
      ];

      apiService.getBulkCompaniesInfo = (): Observable<BulkCompaniesInfo> => throwError(error);
      service
        .requireBulkCompaniesInfo(companiesIds)
        .pipe(catchError(() => of()))
        .subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });
  });
});
