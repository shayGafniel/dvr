import { LOCALE_ID, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { applicationInterceptorProviders } from './app-interceptors';
import { ConfigurationApiMockService } from '~/common/services/configuration/configuration-api.mock-service';
import { ConfigurationAPIService } from '~/common/services/configuration/configuration-api.service';
import { CookiesService } from '~/common/services/cookies/cookies.service';
import { GateApiMockService } from '~/common/services/gate/gate-api-mock.service';
import { ImaginaryMockService } from '~/common/services/imaginary/imaginary.mock-service';
import { ImaginaryService } from '~/common/services/imaginary/imaginary.service';
import { LoggerService } from '~/common/services/logger/logger.service';
import {
  MOCK_SERVICES,
  MockCollectionService,
} from '~/common/services/mock-collection/mock-collection.service';
import { SecurityApiService } from '~/common/services/security/security-api.service';
import { SecurityService } from '~/common/services/security/security.service';
import { ConfigurationEffects } from '~/common/services/store/configuration/configuration.effects';
import { GateRailsEffects } from '~/common/services/store/gate-rails/gate-rails.effects';
import { VendorManagementApiMockService } from '~/common/services/vendor-management/vendor-management-api.mock-service';
import { WindowRefService } from '~/common/services/window.service';
import { RouterEffects } from '~/common/store/router/router.effects';
import { NavigationComponent } from './components/navigation/navigation.component';
import { StylesComponent } from './components/styles/styles.component';
import { DashboardApiMockService } from '~/dashboard/services/dashboard-api/dashboard-api.mock-service';
import { DvrApiMockService } from '~/dvr/services/dvr-api/dvr-api.mock-service';
import { environment } from 'environments/environment';
import { httpInterceptorProviders } from './http-interceptors';
import { IconsService } from './services/icons.service';
import { MainFiltersService } from './services/main-filters.service';
import { TableauService } from './services/tableau/tableau.service';
import { TableauMockService } from './services/tableau/tableau-mock.service';
import { TableauApiMockService } from './services/tableau/tableau-api.mock-service';
import { TableauApiService } from './services/tableau/tableau-api.service';
import { SharedModule } from '~/shared/shared.module';
import { UserDataEffects } from '~/common/services/store/user-data/user-data.effects';
import { MainFiltersEffects } from './store/main-filters/main-filters.effects';
import { reducers as coreReducers } from './store/reducers';
import { AccountsService } from '~/core/services/accounts/accounts.service';
import { AccountMockService } from '~/core/services/accounts/account-mock.service';
import { RoleGuardService } from '~/core/guards/role-guard.service';
import { CanActivateUrlWithoutAccId } from '~/core/guards/url-account-id-guard.service';

const mockServices = [
  { provide: MOCK_SERVICES, useClass: ConfigurationApiMockService, multi: true },
  { provide: MOCK_SERVICES, useClass: DashboardApiMockService, multi: true },
  { provide: MOCK_SERVICES, useClass: DvrApiMockService, multi: true },
  { provide: MOCK_SERVICES, useClass: GateApiMockService, multi: true },
  { provide: MOCK_SERVICES, useClass: ImaginaryMockService, multi: true },
  { provide: MOCK_SERVICES, useClass: TableauApiMockService, multi: true },
  { provide: MOCK_SERVICES, useClass: VendorManagementApiMockService, multi: true },
  ];

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    StoreModule.forFeature('core', coreReducers),
    EffectsModule.forRoot([
      ConfigurationEffects,
      GateRailsEffects,
      MainFiltersEffects,
      RouterEffects,
      UserDataEffects,
    ]),
  ],
  providers: [
    CanActivateUrlWithoutAccId,
    ConfigurationAPIService,
    CookiesService,
    IconsService,
    ImaginaryService,
    LoggerService,
    MainFiltersService,
    RoleGuardService,
    SecurityApiService,
    SecurityService,
    TableauApiService,
    WindowRefService,

    { provide: AccountsService, useClass: environment.isMock ? AccountMockService : AccountsService },
    { provide: TableauService, useClass: environment.isMock ? TableauMockService : TableauService },
    applicationInterceptorProviders,
    httpInterceptorProviders,
    { provide: LOCALE_ID, useValue: 'en-US' }, // for showing currency right of value
    environment.isMock ? MockCollectionService : [],
    environment.isMock ? mockServices : [],
  ],
  declarations: [NavigationComponent, StylesComponent],
  exports: [NavigationComponent],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
