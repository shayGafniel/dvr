import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {ImaginaryPipe} from '../common/pipes/imaginary/imaginary.pipe';
import {AmountComponent} from './components/amount/amount.component';
import {ApproveComponent} from './components/approve/approve.component';
import {CasesComponent} from './components/cases/cases.component';
import {CasesFilterComponent} from './components/cases-filter/cases-filter.component';
import {CasesListComponent} from './components/cases-list/cases-list.component';
import {CommentPopupComponent} from './components/comment-popup/comment-popup.component';
import {CountryFilterComponent} from './components/country-filter/country-filter.component';
import {DateRangeComponent} from './components/date-range/date-range.component';
import {DvrComponent} from './components/dvr.component';
import {LinearChartComponent} from './components/linear-chart/linear-chart.component';
import {PieChartComponent} from './components/pie-chart/pie-chart.component';
import {PotentialComponent} from './components/potential/potential.component';
import {RefundEntitiesComponent} from './components/refund-entities/refund-entities.component';
import {RefundsApproveListComponent} from './components/refunds-approve-list/refunds-approve-list.component';
import {RefundsListComponent} from './components/refunds-list/refunds-list.component';
import {SummaryComponent} from './components/summary/summary.component';
import {DvrRoutingModule} from './dvr-routing.module';
import {ApproveService} from './services/approve/approve.service';
import {DvrService} from './services/dvr/dvr.service';
import {DvrApiService} from './services/dvr-api/dvr-api.service';
import {TreeDatabaseService} from './services/tree-database/tree-database.service';
import {SharedModule} from '../shared/shared.module';
import {DvrEffects} from './store/dvr.effects';
import * as fromDvr from './store/reducers';
import {initialState} from '~/dvr/store/dvr/dvr.reducer';

@NgModule({
  imports: [
    DvrRoutingModule,
    SharedModule,
    StoreModule.forFeature('dvr', fromDvr.reducers, {metaReducers: fromDvr.metaReducers}),
    StoreModule.forRoot(fromDvr.reducers),
    EffectsModule.forFeature([DvrEffects]),
    EffectsModule.forRoot([DvrEffects])
  ],
  declarations: [
    AmountComponent,
    ApproveComponent,
    CasesComponent,
    CasesFilterComponent,
    CasesListComponent,
    CommentPopupComponent,
    CountryFilterComponent,
    DateRangeComponent,
    DvrComponent,
    LinearChartComponent,
    PieChartComponent,
    PotentialComponent,
    RefundEntitiesComponent,
    RefundsApproveListComponent,
    RefundsListComponent,
    SummaryComponent,
  ],
  entryComponents: [],
  providers: [ApproveService, DvrApiService, DvrService, ImaginaryPipe, TreeDatabaseService],
  exports: [DvrComponent],
})
export class DvrModule {
}
