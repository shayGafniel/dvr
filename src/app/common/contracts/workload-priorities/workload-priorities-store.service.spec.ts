import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as fromExpedite from '../../services/store/expedite/expedite.reducer';
import { workloadPriorities } from '../../services/store/expedite/expedite.reducer.spec';
import { selectExpediteWorkloadPriorities, State } from '../../services/store/reducers';
import { WorkloadPrioritiesResponse, WorkloadPriority } from '../../models/work-dispatcher.model';
import { AppState } from '../../store/reducers';
import * as fromActions from './workload-priorities.actions';
import { WorkloadPrioritiesApiImpl } from './workload-priorities-api.service.spec';
import { WorkloadPrioritiesStoreService } from './workload-priorities-store.service';

const error = new Error('Test error');
const group = fromExpedite.group;
const workloadPrioritiesResponse: WorkloadPrioritiesResponse = { workloads: workloadPriorities };

@Injectable()
class WorkloadPrioritiesStoreImpl extends WorkloadPrioritiesStoreService {
  private static selectors = {
    workloadPriorities: selectExpediteWorkloadPriorities,
  };

  constructor(protected api: WorkloadPrioritiesApiImpl, protected store: Store<AppState & State>) {
    super(api, store, WorkloadPrioritiesStoreImpl.selectors, group);
  }
}

describe('WorkloadPrioritiesStoreService', () => {
  let apiService: WorkloadPrioritiesApiImpl;
  let service: WorkloadPrioritiesStoreImpl;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          core: combineReducers({
            expedite: fromExpedite.reducer,
          }),
        }),
      ],
      providers: [WorkloadPrioritiesApiImpl, WorkloadPrioritiesStoreImpl],
    });
  }));

  beforeEach(() => {
    apiService = TestBed.get(WorkloadPrioritiesApiImpl);
    service = TestBed.get(WorkloadPrioritiesStoreImpl);
    store = TestBed.get(Store);
  });

  describe('requireWorkloadPriorities$', () => {
    it('should dispatch successful actions with data', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetWorkloadPriorities(group)],
        [new fromActions.GetWorkloadPrioritiesSuccess(group)],
        [new fromActions.LoadWorkloadPriorities(group, { workloadPriorities })],
      ];

      apiService.getWorkloadPriorities = (): Observable<WorkloadPriority[]> =>
        of(workloadPriorities);
      service.requireWorkloadPriorities$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetWorkloadPriorities(group)],
        [new fromActions.GetWorkloadPrioritiesFail(group, error)],
      ];

      apiService.getWorkloadPriorities = (): Observable<WorkloadPriority[]> => throwError(error);
      service.requireWorkloadPriorities$.pipe(catchError(() => of())).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });
  });

  describe('workloadPriorities$', () => {
    it('should set and return workloadPriorities from the store', () => {
      const response = cold('-a|', { a: workloadPriorities });
      apiService.getWorkloadPriorities = (): Observable<WorkloadPriority[]> => response;

      const expected = cold('bc-', { b: [], c: workloadPriorities });

      expect(service.workloadPriorities$).toBeObservable(expected);
    });
  });

  describe('updateWorkloadPriority', () => {
    it('should dispatch successful actions with data', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.UpdateWorkloadPriorities(group)],
        [new fromActions.UpdateWorkloadPrioritiesSuccess(group)],
      ];

      apiService.updateWorkloadPriorityCall = (): Observable<any> => of(null);
      service.updateWorkloadPriority(workloadPrioritiesResponse).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.UpdateWorkloadPriorities(group)],
        [new fromActions.UpdateWorkloadPrioritiesFail(group, error)],
      ];

      apiService.updateWorkloadPriorityCall = (): Observable<any> => throwError(error);
      service
        .updateWorkloadPriority(workloadPrioritiesResponse)
        .pipe(catchError(() => of()))
        .subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });
  });
});
