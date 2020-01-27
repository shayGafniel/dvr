import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { selectMatcherWorkEntities, State } from '../../services/store/reducers';
import * as fromMatcher from '../../services/store/matcher/matcher.reducer';
import { workEntities } from '../../services/store/matcher/matcher.reducer.spec';
import { WorkEntity } from '../../models/work-dispatcher.model';
import { AppState } from '../../store/reducers';
import * as fromActions from './work-entities.actions';
import { WorkEntitiesStoreService } from './work-entities-store.service';
import { WorkEntitiesApiImpl } from './work-entities-api.service.spec';

const error = new Error('Test error');
const group = fromMatcher.group;

@Injectable()
class WorkloadPrioritiesStoreImpl extends WorkEntitiesStoreService {
  private static selectors = {
    workEntities: selectMatcherWorkEntities,
  };

  constructor(protected api: WorkEntitiesApiImpl, protected store: Store<AppState & State>) {
    super(api, store, WorkloadPrioritiesStoreImpl.selectors, group);
  }
}

describe('WorkEntitiesStoreService', () => {
  let apiService: WorkEntitiesApiImpl;
  let service: WorkloadPrioritiesStoreImpl;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          core: combineReducers({
            matcher: fromMatcher.reducer,
          }),
        }),
      ],
      providers: [WorkEntitiesApiImpl, WorkloadPrioritiesStoreImpl],
    });
  }));

  beforeEach(() => {
    apiService = TestBed.get(WorkEntitiesApiImpl);
    service = TestBed.get(WorkloadPrioritiesStoreImpl);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('requireWorkEntities$', () => {
    it('should dispatch successful actions with data', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetWorkEntities(group)],
        [new fromActions.GetWorkEntitiesSuccess(group)],
        [new fromActions.LoadWorkEntities(group, { workEntities })],
      ];

      apiService.getWorkEntities = (): Observable<WorkEntity[]> => of(workEntities);
      service.requireWorkEntities$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetWorkEntities(group)],
        [new fromActions.GetWorkEntitiesFail(group, error)],
      ];

      apiService.getWorkEntities = (): Observable<WorkEntity[]> => throwError(error);
      service.requireWorkEntities$.pipe(catchError(() => of())).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });
  });

  describe('workEntities$', () => {
    it('should set and return workEntities from the store', () => {
      const response = cold('-a|', { a: workEntities });
      apiService.getWorkEntities = (): Observable<WorkEntity[]> => response;

      const expected = cold('bc-', { b: [], c: workEntities });

      expect(service.workEntities$).toBeObservable(expected);
    });
  });

  describe('updateWorkEntity', () => {
    const entitiesIds = ['42', '2', '3'];

    it('should dispatch successful actions with data', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.UpdateWorkEntities(group)],
        [new fromActions.UpdateWorkEntitiesSuccess(group)],
      ];

      apiService.updateWorkEntities = (): Observable<any> => of(null);
      service.updateWorkEntity(entitiesIds).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.UpdateWorkEntities(group)],
        [new fromActions.UpdateWorkEntitiesFail(group, error)],
      ];

      apiService.updateWorkEntities = (): Observable<any> => throwError(error);
      service
        .updateWorkEntity(entitiesIds)
        .pipe(catchError(() => of()))
        .subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });
  });
});
