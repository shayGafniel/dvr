import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApproveService } from './approve.service';
import { ConfigurationAPIService } from '../../../common/services/configuration/configuration-api.service';
import { LoadUserData } from '../../../common/services/store/user-data/user-data.actions';
import * as fromUserData from '../../../common/services/store/user-data/user-data.reducer';
import { Go } from '../../../common/store/router/router.actions';
import * as fromMainFilters from '../../../core/store/main-filters/main-filters.reducer';
import { DvrService } from '../dvr/dvr.service';
import { DvrApiService } from '../dvr-api/dvr-api.service';
import { groupedRefunds } from '../../helpers/approve.helper.spec';
import { DvrHelper } from '../../helpers/dvr.helper';
import { CasesResponse } from '../../models/case.model';
import { Approve, Refund } from '../../models/dvr.model';
import * as fromActions from '../../store/approve/approve.actions';
import * as fromApprove from '../../store/approve/approve.reducer';
import { approve, approveHash } from '../../store/approve/approve.reducer.spec';
import * as fromCasesActions from '../../store/cases/cases.actions';
import * as fromCases from '../../store/cases/cases.reducer';
import { cases, casesResponse } from '../../store/cases/cases.reducer.spec';
import * as fromCasesFilterForm from '../../store/cases-filter-form/cases-filter-form.reducer';
import {
  DisableDateRange,
  FillDateRange,
  InitDateRanges,
} from '../../store/date-range-form/date-range-form.actions';
import * as fromDateRangeForm from '../../store/date-range-form/date-range-form.reducer';
import * as fromDvrActions from '../../store/dvr/dvr.actions';
import * as fromDvr from '../../store/dvr/dvr.reducer';
import { account } from '../../store/dvr/dvr.reducer.spec';
import { GateApiService } from '../../../common/services/gate/gate-api.service';

const {
  entity: { id: entityId },
} = approve;
const accountId = parseInt(approve.account.id, 10);
const error = new Error('Test error');

describe('ApproveService', () => {
  let apiService: DvrApiService;
  let service: ApproveService;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          core: combineReducers({
            mainFilters: fromMainFilters.reducer,
            userData: fromUserData.reducer,
          }),
          dvr: combineReducers({
            approve: fromApprove.reducer,
            cases: fromCases.reducer,
            casesFilter: fromCasesFilterForm.reducer,
            dateRangeForm: fromDateRangeForm.reducer,
            dvr: fromDvr.reducer,
          }),
        }),
      ],
      providers: [ApproveService, GateApiService, ConfigurationAPIService, DvrApiService, DvrService],
    });
  }));

  beforeEach(() => {
    apiService = TestBed.get(DvrApiService);
    service = TestBed.get(ApproveService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  function setApproveHash(hash = approveHash): void {
    store.dispatch(new fromActions.SetApproveHash({ approveHash: hash }));
  }

  function setEmptyApproveHash(): void {
    setApproveHash('');
  }

  function setActiveAccountId(activeAccountId = accountId): void {
    store.dispatch(new fromDvrActions.SetActiveAccountId({ activeAccountId }));
  }

  function setActiveEmptyAccountId(): void {
    setActiveAccountId(null);
  }

  function setEmail(email = '1@1'): void {
    store.dispatch(new LoadUserData({ email }));
  }

  function loadAccount(): void {
    store.dispatch(new fromDvrActions.LoadAccount({ account }));
  }

  describe('requireApprove$', () => {
    beforeEach(() => {
      setApproveHash();
    });

    it('should dispatch successful actions with data', () => {
      const spyStore = spyOn(store, 'dispatch');
      const entityIds = [entityId];
      const { end, start } = approve;
      const refundsActions: Action[][] = Object.entries(groupedRefunds).reduce(
        (accumulator: Action[][], [countryCode, refundsByCounty]: [string, Refund[]]) => {
          const selectedFlatNodes = DvrHelper.generateFlatNodesFromRefunds(refundsByCounty);

          return [
            ...accumulator,
            [
              new fromDvrActions.LoadRefunds({
                accountId,
                countryCode,
                entityId,
                refunds: refundsByCounty,
              }),
            ],
            [
              new fromDvrActions.SetSelectedFlatNodes({
                accountId,
                countryCode,
                entityId,
                selectedFlatNodes,
              }),
            ],
          ];
        },
        [],
      );
      const actions = [
        [new fromActions.GetApprove()],
        [new fromActions.GetApproveSuccess()],
        [new fromActions.LoadApprove({ approve, approveHash })],
        [new InitDateRanges({ accountId, entityIds })],
        [new FillDateRange({ accountId, entityId, range: { end, start } })],
        [new DisableDateRange({ accountId, entityId })],
        [new fromDvrActions.LoadAccount({ account })],
        [new fromDvrActions.LoadEntities({ accountId, entities: [approve.entity] })],
        [new fromDvrActions.SetActiveAccountId({ activeAccountId: accountId })],
        [new fromDvrActions.SetActiveEntityId({ activeEntityId: entityId })],
        ...refundsActions,
      ];

      apiService.getApprove = (): Observable<Approve> => of(approve);
      service.requireApprove$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [[new fromActions.GetApprove()], [new fromActions.GetApproveFail(error)]];

      apiService.getApprove = (): Observable<Approve> => throwError(error);
      service.requireApprove$.pipe(catchError(() => of())).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should filter empty approveHash', () => {
      setEmptyApproveHash();

      expect(service.requireApprove$).toBeObservable(cold('-'));
    });
  });

  describe('approve$', () => {
    beforeEach(() => {
      setApproveHash();
    });

    it('should set and return approve from the store', () => {
      const response = cold('-a|', { a: approve });
      apiService.getApprove = (): Observable<Approve> => response;

      const expected = cold('bc-', { b: null, c: approve });

      expect(service.approve$).toBeObservable(expected);
    });
  });

  describe('doApprove$', () => {
    beforeEach(() => {
      setApproveHash();
      setEmail();
    });

    it('should dispatch successful actions with data', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.DoApprove()],
        [new fromActions.DoApproveSuccess()],
        [new fromActions.UpdateApprove({ approve, approveHash })],
      ];

      apiService.doApprove = (): Observable<Approve> => of(approve);
      service.doApprove$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [[new fromActions.DoApprove()], [new fromActions.DoApproveFail(error)]];

      apiService.doApprove = (): Observable<Approve> => throwError(error);
      service.doApprove$.pipe(catchError(() => of())).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });
  });

  describe('requireCases$', () => {
    beforeEach(() => {
      setActiveAccountId();
    });

    it('should dispatch successful actions with data', fakeAsync(() => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromCasesActions.ResetCasesState()],
        [new fromCasesActions.GetCases()],
        [new fromCasesActions.GetCasesSuccess()],
        [new fromCasesActions.LoadCases({ cases })],
        [new fromCasesActions.LoadStatistics({ statistics: casesResponse.statistics })],
      ];

      apiService.getCases = (): Observable<CasesResponse> => of(casesResponse);
      service.requireCases$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    }));

    it('should dispatch failed actions', fakeAsync(() => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromCasesActions.ResetCasesState()],
        [new fromCasesActions.GetCases()],
        [new fromCasesActions.GetCasesFail(error)],
      ];

      apiService.getCases = (): Observable<CasesResponse> => throwError(error);
      service.requireCases$.pipe(catchError(() => of())).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    }));

    it('should filter empty active account id', () => {
      setActiveEmptyAccountId();

      expect(service.requireCases$).toBeObservable(cold('-'));
    });
  });

  describe('cases$', () => {
    beforeEach(() => {
      loadAccount();
      setActiveAccountId();
    });

    it('should set and return cases from the store', fakeAsync(() => {
      const response = cold('-a|', { a: casesResponse });
      apiService.getCases = (): Observable<CasesResponse> => response;

      const expected = cold('bc-', { b: null, c: cases });

      expect(service.cases$).toBeObservable(expected);
    }));
  });

  describe('doApprove', () => {
    beforeEach(() => {
      setApproveHash();
    });

    it('should return closed Subscription', fakeAsync(() => {
      apiService.doApprove = (): Observable<Approve> => of(approve);

      const subscription = service.doApprove();
      tick();

      expect(subscription.closed).toBe(true);
    }));
  });

  describe('removeCase', () => {
    beforeEach(() => {
      setActiveAccountId();
      setApproveHash();
    });

    it('should dispatch successful actions', fakeAsync(() => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromCasesActions.RemoveCase()],
        [new fromCasesActions.RemoveCaseSuccess()],
        [new Go({ path: ['/tailored/cases'] })],
      ];

      apiService.removeCase = (): Observable<any> => of(null);
      service.removeCase().subscribe();
      tick();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    }));

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromCasesActions.RemoveCase()],
        [new fromCasesActions.RemoveCaseFail(error)],
      ];

      apiService.removeCase = (): Observable<any> => throwError(error);
      service
        .removeCase()
        .pipe(catchError(() => of()))
        .subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });
  });
});
