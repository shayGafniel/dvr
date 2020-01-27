import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EmptyRouteComponent} from './empty-route/empty-route.component';
import {DvrModule} from './dvr/dvr.module';
import {StoreModule} from '@ngrx/store';
import {reducers} from '~/common/store/reducers';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {APP_BASE_HREF} from '@angular/common';
import {SecurityApiService} from '~/common/services/security/security-api.service';
import {HttpClientModule} from '@angular/common/http';
import {GateApiService} from '~/common/services/gate/gate-api.service';


@NgModule({
  declarations: [
    AppComponent,
    EmptyRouteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DvrModule,
    StoreModule.forRoot(reducers),   // router
    CoreModule,
    SharedModule,
    HttpClientModule
  ],


  providers: [{provide: APP_BASE_HREF, useValue: '/app2/'}, SecurityApiService, GateApiService],
git 

  bootstrap: [AppComponent]
})
export class AppModule {
}
