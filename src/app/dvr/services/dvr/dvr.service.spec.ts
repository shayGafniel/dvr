import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ConfigurationAPIService } from '../../../common/services/configuration/configuration-api.service';
import { LoadUserData } from '../../../common/services/store/user-data/user-data.actions';
import * as fromUserData from '../../../common/services/store/user-data/user-data.reducer';
import { SetAccount } from '../../../core/store/main-filters/main-filters.actions';
import * as fromMainFilters from '../../../core/store/main-filters/main-filters.reducer';
import { DvrService } from './dvr.service';
import { DvrApiService } from '../dvr-api/dvr-api.service';
import { DvrHelper } from '../../helpers/dvr.helper';
import { AccountEntity, DvrStatistics, Refund, RefundsRequest } from '../../models/dvr.model';
import { DvrMock } from '../../services/dvr-api/dvr.mock';
import * as fromAmountForm from '../../store/amount-form/amount-form.reducer';
import { amount } from '../../store/amount-form/amount-form.reducer.spec';
import { InitComments } from '../../store/comment-form/comment-form.actions';
import * as fromCommentForm from '../../store/comment-form/comment-form.reducer';
import {
  DisableDateRange,
  EnableDateRange,
  FillDateRange,
  InitDateRanges,
} from '../../store/date-range-form/date-range-form.actions';
import * as fromDateRangeForm from '../../store/date-range-form/date-range-form.reducer';
import { end, range, start } from '../../store/date-range-form/date-range-form.reducer.spec';
import * as fromActions from '../../store/dvr/dvr.actions';
import {
  account,
  accountId,
  countryCode,
  entities,
  entityId,
  entityIds,
  potentialForAccount,
  potentialForEntity,
  statistics,
} from '../../store/dvr/dvr.reducer.spec';
import * as fromDvr from '../../store/dvr/dvr.reducer';
import { selectedFlatNodesWithAmount } from '../../store/dvr/dvr.selects.spec';
import { FillCountry } from '../../store/refund-filter-form/refund-filter-form.actions';
import * as fromRefundFilterForm from '../../store/refund-filter-form/refund-filter-form.reducer';
import { GateApiService } from '../../../common/services/gate/gate-api.service';

const error = new Error('Test error');
export const hash = DvrMock.createDraft();
const refunds = DvrMock.refunds;

describe('DvrService', () => {
  let apiService: DvrApiService;
  let configurationService: ConfigurationAPIService;
  let service: DvrService;
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
            amountForm: fromAmountForm.reducer,
            commentForm: fromCommentForm.reducer,
            dateRangeForm: fromDateRangeForm.reducer,
            dvr: fromDvr.reducer,
            refundFilterForm: fromRefundFilterForm.reducer,
          }),
        }),
      ],
      providers: [ConfigurationAPIService, GateApiService, DvrApiService, DvrService],
    });
  }));

  beforeEach(() => {
    apiService = TestBed.get(DvrApiService);
    configurationService = TestBed.get(ConfigurationAPIService);
    service = TestBed.get(DvrService);
    store = TestBed.get(Store);
    service.subscriptions.forEach(subscription => subscription.unsubscribe());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  function setAccount(): void {
    store.dispatch(new SetAccount(account));
  }

  function setActiveAccountId(activeAccountId = accountId): void {
    store.dispatch(new fromActions.SetActiveAccountId({ activeAccountId }));
  }

  function setActiveEmptyAccountId(): void {
    setActiveAccountId(null);
  }

  function setActiveEntityId(activeEntityId: string = entityId): void {
    store.dispatch(new fromActions.SetActiveEntityId({ activeEntityId }));
  }

  function setActiveEmptyEntityId(): void {
    setActiveEntityId('');
  }

  function setActiveCountryCode(country: string = countryCode): void {
    store.dispatch(new FillCountry({ country: { display: country, value: country } }));
  }

  function setActiveEmptyCountryCode(): void {
    setActiveCountryCode('');
  }

  function setSelectedFlatNodes(selectedFlatNodes = selectedFlatNodesWithAmount) {
    store.dispatch(
      new fromActions.SetSelectedFlatNodes({
        accountId,
        countryCode,
        entityId,
        selectedFlatNodes,
      }),
    );
  }

  function setEmail(email = '1@1'): void {
    store.dispatch(new LoadUserData({ email }));
  }

  function setEmptyEmail(): void {
    setEmail('');
  }

  function setEmptySelectedFlatNodes() {
    setSelectedFlatNodes([]);
  }

  function setRange(): void {
    store.dispatch(new InitDateRanges({ accountId, entityIds }));
    store.dispatch(new FillDateRange({ accountId, entityId, range }));
  }

  function setEmptyRange(): void {
    store.dispatch(new InitDateRanges({ accountId, entityIds: [] }));
  }

  function loadAccount(): void {
    store.dispatch(new fromActions.LoadAccount({ account }));
  }

  function loadAccountStatistics(): void {
    store.dispatch(new fromActions.LoadAccountStatistics({ accountId, statistics }));
  }

  function loadEntities(): void {
    store.dispatch(new fromActions.LoadEntities({ accountId, entities }));
  }

  function loadRefunds(): void {
    store.dispatch(new fromActions.LoadRefunds({ accountId, countryCode, entityId, refunds }));
  }

  describe('accountChanges$', () => {
    beforeEach(() => {
      setAccount();
    });

    it('should dispatch action if account is changed', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.ResetActiveEntityId()],
        [new fromActions.LoadAccount({ account })],
        [new fromActions.SetActiveAccountId({ activeAccountId: account.accountId })],
      ];

      service.accountChanges$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });
  });

  describe('requireAccountStatistics$', () => {
    beforeEach(() => {
      setActiveAccountId();
    });

    it('should dispatch successful actions with data', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetAccountStatistics()],
        [new fromActions.GetAccountStatisticsSuccess()],
        [new fromActions.LoadAccountStatistics({ accountId, statistics })],
      ];

      apiService.getAccountStatistics = (): Observable<DvrStatistics> => of(statistics);
      service.requireAccountStatistics$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetAccountStatistics()],
        [new fromActions.GetAccountStatisticsFail(error)],
      ];

      apiService.getAccountStatistics = (): Observable<DvrStatistics> => throwError(error);
      service.requireAccountStatistics$.pipe(catchError(() => of())).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should filter empty active account id', () => {
      setActiveEmptyAccountId();

      expect(service.requireAccountStatistics$).toBeObservable(cold('-'));
    });

    it('should filter already loaded data', async(() => {
      loadAccountStatistics();

      expect(service.requireAccountStatistics$).toBeObservable(cold('-'));
    }));
  });

  describe('potentialForAccount$', () => {
    beforeEach(() => {
      loadAccount();
      setActiveAccountId();
    });

    xit('should set accountStatistics and return potentialForAccount', () => {
      const response = cold('-a|', { a: statistics });
      apiService.getAccountStatistics = (): Observable<DvrStatistics> => response;

      const expected = cold('bc-', { b: null, c: potentialForAccount });

      expect(service.potentialForAccount$).toBeObservable(expected);
    });
  });

  describe('createDraft$', () => {
    beforeEach(() => {
      loadAccount();
      setEmail();
      setActiveAccountId();
      loadEntities();
      setActiveEntityId();
      setActiveCountryCode();
      setRange();
      loadRefunds();
      setSelectedFlatNodes();
    });

    it('should dispatch successful actions with data', fakeAsync(() => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.CreateDraft()],
        [new fromActions.CreateDraftSuccess(hash)],
        [new fromActions.ResetSelectedFlatNodesOfEntity({ accountId, entityId })],
      ];

      apiService.createDraft = (): Observable<any> => of(hash);
      service.createDraft$.subscribe();
      tick();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    }));

    it('should dispatch failed actions', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [[new fromActions.CreateDraft()], [new fromActions.CreateDraftFail(error)]];

      apiService.createDraft = (): Observable<any> => throwError(error);
      service.createDraft$.pipe(catchError(() => of())).subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should filter empty selected flat nodes', () => {
      setEmptySelectedFlatNodes();

      expect(service.createDraft$).toBeObservable(cold('|'));
    });

    it('should filter empty email', () => {
      setEmptyEmail();

      expect(service.createDraft$).toBeObservable(cold('|'));
    });
  });

  describe('dateRangeDisabling$', () => {
    beforeEach(() => {
      loadAccount();
      setActiveAccountId();
      loadEntities();
      setActiveEntityId();
      loadRefunds();
      setSelectedFlatNodes();
      setRange();
    });

    it('should disable date range if the entity has SelectedFlatNodes', () => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [[new DisableDateRange({ accountId, entityId })]];

      service.dateRangeDisabling$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should enable date range if the entity does not have SelectedFlatNodes anymore', () => {
      store.dispatch(new DisableDateRange({ accountId, entityId }));
      store.dispatch(new fromActions.ResetSelectedFlatNodesOfEntity({ accountId, entityId }));

      const spyStore = spyOn(store, 'dispatch');
      const actions = [[new EnableDateRange({ accountId, entityId })]];

      service.dateRangeDisabling$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should do nothing if the entity is updated and the range is disabled', () => {
      store.dispatch(new DisableDateRange({ accountId, entityId }));

      const spyStore = spyOn(store, 'dispatch');
      const actions = [];

      service.dateRangeDisabling$.subscribe();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    });

    it('should filter empty range', () => {
      setEmptyRange();

      expect(service.dateRangeDisabling$).toBeObservable(cold('-'));
    });

    it('should filter situation with asynchronized data', () => {
      store.dispatch(new InitDateRanges({ accountId, entityIds: [entityId, 'notExist'] }));

      expect(service.dateRangeDisabling$).toBeObservable(cold('-'));
    });
  });

  describe('requireEntities$', () => {
    beforeEach(() => {
      setActiveAccountId();
    });

    it('should filter empty active account id', () => {
      setActiveEmptyAccountId();

      expect(service.requireEntities$).toBeObservable(cold('-'));
    });

    it('should filter already loaded data', async(() => {
      loadEntities();

      expect(service.requireEntities$).toBeObservable(cold('-'));
    }));
  });

  describe('requireEntityStatistics$', () => {
    beforeEach(() => {
      setActiveAccountId();
      setActiveEntityId();
      setRange();
    });

    it('should dispatch successful actions with data', fakeAsync(() => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetEntityStatistics()],
        [new fromActions.GetEntityStatisticsSuccess()],
        [new fromActions.LoadEntityStatistics({ accountId, entityId, statistics })],
      ];

      apiService.getEntityStatistics = (): Observable<DvrStatistics> => of(statistics);
      service.requireEntityStatistics$.subscribe();
      tick();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    }));

    it('should dispatch failed actions', fakeAsync(() => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [
        [new fromActions.GetEntityStatistics()],
        [new fromActions.GetEntityStatisticsFail(error)],
      ];

      apiService.getEntityStatistics = (): Observable<DvrStatistics> => throwError(error);
      service.requireEntityStatistics$.pipe(catchError(() => of())).subscribe();
      tick();

      expect(spyStore.calls.allArgs()).toEqual(actions);
    }));

    it('should filter empty active account id', () => {
      setActiveEmptyAccountId();

      expect(service.requireEntityStatistics$).toBeObservable(cold('-'));
    });

    it('should filter empty active entity id', () => {
      setActiveEmptyEntityId();

      expect(service.requireEntityStatistics$).toBeObservable(cold('-'));
    });
  });

  describe('potentialForEntity$', () => {
    beforeEach(() => {
      loadAccount();
      setActiveAccountId();
      loadEntities();
      setActiveEntityId();
      setRange();
    });

    it('should set entityStatistics and return potentialForEntity', fakeAsync(() => {
      const response = cold('-a|', { a: statistics });
      apiService.getEntityStatistics = (): Observable<DvrStatistics> => response;

      const expected = cold('bc-', { b: null, c: potentialForEntity });

      expect(service.potentialForEntity$.pipe(tap(() => tick(), () => tick()))).toBeObservable(
        expected,
      );
    }));
  });

  describe('requireRefunds$', () => {
    beforeEach(() => {
      setActiveAccountId();
      setActiveEntityId();
      setActiveCountryCode();
      setRange();
    });

    it('should dispatch successful actions with data', fakeAsync(() => {
      const spyStore = spyOn(store, 'dispatch');
      const refundComments = DvrHelper.generateRefundCommentsFromRefunds(refunds);
      const actions = [
        [new fromActions.GetRefunds()],
        [new fromActions.GetRefundsSuccess()],
        [new fromActions.LoadRefunds({ accountId, countryCode, entityId, refunds })],
        [new InitComments({ accountId, entityId, refundComments })],
      ];

      apiService.getRefunds = (): Observable<Refund[]> => of(refunds);
      service.requireRefunds$.subscribe();
      tick(DvrService.amountDebounce + 1);

      expect(spyStore.calls.allArgs()).toEqual(actions);
    }));

    it('should dispatch failed actions', fakeAsync(() => {
      const spyStore = spyOn(store, 'dispatch');
      const actions = [[new fromActions.GetRefunds()], [new fromActions.GetRefundsFail(error)]];

      apiService.getRefunds = (): Observable<Refund[]> => throwError(error);
      service.requireRefunds$.pipe(catchError(() => of())).subscribe();
      tick(DvrService.amountDebounce + 1);

      expect(spyStore.calls.allArgs()).toEqual(actions);
    }));

    it('should get correct params to api call', fakeAsync(() => {
      loadAccount();
      loadEntities();

      const spyApiCall = spyOn(apiService, 'getRefunds').and.returnValue(of(refunds));

      service.requireRefunds$.subscribe();
      tick(DvrService.amountDebounce + 1);

      const expected: RefundsRequest[][] = [
        [
          {
            accountId,
            entityId,
            params: {
              amountFrom: amount.toString(),
              amountTo: null,
              country: countryCode,
              end,
              start,
            },
          },
        ],
      ];

      expect(spyApiCall.calls.allArgs()).toEqual(expected);
    }));

    it('should filter empty active entity id', () => {
      setActiveEmptyCountryCode();

      expect(service.requireRefunds$).toBeObservable(cold('-'));
    });

    it('should filter already loaded data', async(() => {
      loadAccount();
      loadEntities();
      loadRefunds();

      expect(service.requireRefunds$).toBeObservable(cold('-'));
    }));
  });

  describe('refunds$', () => {
    beforeEach(() => {
      loadAccount();
      setActiveAccountId();
      loadEntities();
      setActiveEntityId();
      setActiveCountryCode();
      setRange();
    });

    it('should set and return refunds', fakeAsync(() => {
      const response = cold('-a|', { a: refunds });
      apiService.getRefunds = (): Observable<Refund[]> => response;

      const expected = cold('bc-', { b: [], c: refunds });

      expect(
        service.refunds$.pipe(
          tap(() => tick(DvrService.amountDebounce + 1), () => tick(DvrService.amountDebounce + 1)),
        ),
      ).toBeObservable(expected);
    }));
  });

  describe('createDraft', () => {
    beforeEach(() => {
      loadAccount();
      setEmail();
      setActiveAccountId();
      loadEntities();
      setActiveEntityId();
      setActiveCountryCode();
      setRange();
      loadRefunds();
      setSelectedFlatNodes();
    });

    it('should return closed Subscription', fakeAsync(() => {
      apiService.createDraft = (): Observable<any> => of(null);

      const subscription = service.createDraft();
      tick();

      expect(subscription.closed).toBe(true);
    }));
  });

  describe('getStatisticForAccount', () => {
    beforeEach(() => {
      setActiveAccountId();
    });

    it('should return closed Subscription', () => {
      apiService.getAccountStatistics = (): Observable<DvrStatistics> => of(statistics);

      const subscription = service.getStatisticForAccount();

      expect(subscription.closed).toBe(true);
    });
  });

  describe('getStatisticForEntity', () => {
    beforeEach(() => {
      loadAccount();
      setActiveAccountId();
      loadEntities();
      setActiveEntityId();
      setRange();
    });

    it('should return closed Subscription', fakeAsync(() => {
      apiService.getEntityStatistics = (): Observable<DvrStatistics> => of(statistics);

      const subscription = service.getStatisticForEntity();
      tick();

      expect(subscription.closed).toBe(true);
    }));
  });
});
