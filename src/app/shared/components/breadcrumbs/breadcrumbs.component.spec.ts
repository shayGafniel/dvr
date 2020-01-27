import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ROUTER_NAVIGATED,
  RouterNavigatedAction,
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { AlertService } from '../../../common/services/alert/alert.service';
import { Go } from '../../../common/store/router/router.actions';
import { RouterSerializer, RouterStateUrl, State } from '../../../common/store/router/router.serializer';
import * as fromReclaimShow from '../../../reclaims/store/reclaim-show/reclaim-show.reducer';
import * as fromReclaimCounts from '../../../reclaims/store/reclaims-list-counts/reclaims-list-counts.reducer';
import * as fromReclaimsList from '../../../reclaims/store/reclaims-list/reclaims-list.reducer';
import { SharedModule } from '../../../shared/shared.module';

describe('BreadcrumbsComponent', () => {
  // let component: BreadcrumbComponent;
  // let fixture: ComponentFixture<BreadcrumbComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: of(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        StoreModule.forRoot({
          router: routerReducer,
          reclaims: combineReducers({
            reclaimShow: fromReclaimShow.reducer,
            reclaimsList: fromReclaimsList.reducer,
            reclaimsCounts: fromReclaimCounts.reducer,
          }),
        }),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        RouterTestingModule,
      ],
      declarations: [BreadcrumbsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RouterStateSerializer, useClass: RouterSerializer },
        AlertService,
      ],
    });
  }));

  beforeEach(() => {
    const store: Store<State> = TestBed.get(Store);
    store.dispatch({
      type: ROUTER_NAVIGATED,
      payload: {
        routerState: {
          url: '/tailored',
          params: {},
          queryParams: {},
          dataOfPaths: [],
        },
        event: {
          id: 1,
          url: '/tailored',
          urlAfterRedirects: '/tailored',
          state: {
            url: '/tailored',
            params: {},
            queryParams: {},
          },
        },
      },
    } as RouterNavigatedAction<RouterStateUrl>);
    store.dispatch(new Go({ path: ['/test'] }));

    // fixture = TestBed.createComponent(BreadcrumbComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  // it('should create', async(() => {
  //   expect(component).toBeTruthy();
  // }));
});
