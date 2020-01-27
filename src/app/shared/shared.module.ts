import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatBadgeModule,
  MatMenuModule,
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { ChartsModule } from 'ng2-charts';
import { NgrxFormsModule } from 'ngrx-forms';

import { SharedCommonModule } from '~/common/shared-common.module';
import { AdvancedFilterDbDialogComponent } from './components/advanced-filter-dialog/advanced-filter-db-dialog.component';
import { BackComponent } from './components/back/back.component';
import { BasicFilterComponent } from './components/basic-filter/basic-filter.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ButtonToggleComponent } from './components/button-toggle/button-toggle.component';
import { ContentContainerComponent } from './components/content-container/content-container.component';
import { ContentLoaderBlockComponent } from './components/content-loader-block/content-loader-block.component';
import { ContentLoaderInputComponent } from './components/content-loader-input/content-loader-input.component';
import { ContentLoaderTableauComponent } from './components/content-loader-tableau/content-loader-tableau.component';
import { MultiselectAutocompleteComponent } from './components/multiselect-autocomplete/multiselect-autocomplete.component';
import { SummaryLineComponent } from './components/summary-line/summary-line.component';
import { SummaryLineBlockComponent } from './components/summary-line/summary-line-block/summary-line-block.component';
import { dateFormat } from './configurations/date.configuration';
import { BackgroundColorDirective } from './directives/background-color.directive';
import { MaterialModule } from './material.module';
import { CurrencyConverterPipe } from './pipes/currency-converter/currency-converter.pipe';
import { CurrencyConverterService } from './services/currency-converter.service';
import { SharedDialogComponent } from './components/shared-dialog/shared-dialog.component';
import { SpaceCurrencyFormatterPipe } from './pipes/space-currency-formatter/space-currency-formatter.pipe';
import { RestrictLettersOnlyDirective } from './directives/lettersonly-validator.directive';
import { RestrictSpecialCharacterInputFieldDirective } from './directives/restricspecialcharacter-validator.directive';
import { RestrictNumberCharacterInputFieldDirective } from './directives/restricspecialcharacterforphone-validator.directive';
import { RestrictAddressCharacterInputFieldDirective } from './directives/restricspecialcharacteraddress-validator.directive';
import { RestrictSpecialCharacterCompanyCodeInputFieldDirective } from './directives/restricspecialcharacter_companycode-validator.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IsEllipsisActiveDirective } from './directives/is-ellipsis-active.directive';

@NgModule({
  declarations: [
    AdvancedFilterDbDialogComponent,
    BackComponent,
    BasicFilterComponent,
    BreadcrumbsComponent,
    ButtonToggleComponent,
    ContentContainerComponent,
    ContentLoaderBlockComponent,
    ContentLoaderInputComponent,
    ContentLoaderTableauComponent,
    CurrencyConverterPipe,
    SpaceCurrencyFormatterPipe,
    MultiselectAutocompleteComponent,
    SummaryLineComponent,
    SummaryLineBlockComponent,
    BackgroundColorDirective,
    RestrictLettersOnlyDirective,
    RestrictSpecialCharacterInputFieldDirective,
    RestrictNumberCharacterInputFieldDirective,
    RestrictAddressCharacterInputFieldDirective,
    RestrictSpecialCharacterCompanyCodeInputFieldDirective,
    IsEllipsisActiveDirective,
    SharedDialogComponent,
  ],
  imports: [
    ChartsModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    InlineSVGModule,
    MatBadgeModule,
    MaterialModule,
    MatMenuModule,
    NgrxFormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedCommonModule,
    ScrollingModule,
  ],
  exports: [
    // Modules
    ChartsModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    InlineSVGModule,
    MatBadgeModule,
    MaterialModule,
    MatMenuModule,
    NgrxFormsModule,
    ReactiveFormsModule,
    SharedCommonModule,

    // Components
    AdvancedFilterDbDialogComponent,
    BackComponent,
    BasicFilterComponent,
    BreadcrumbsComponent,
    ButtonToggleComponent,
    ContentContainerComponent,
    ContentLoaderBlockComponent,
    ContentLoaderInputComponent,
    ContentLoaderTableauComponent,
    MultiselectAutocompleteComponent,
    SummaryLineBlockComponent,
    SummaryLineComponent,
    SharedDialogComponent,

    // Directives
    BackgroundColorDirective,
    RestrictLettersOnlyDirective,
    RestrictSpecialCharacterInputFieldDirective,
    RestrictNumberCharacterInputFieldDirective,
    RestrictAddressCharacterInputFieldDirective,
    RestrictSpecialCharacterCompanyCodeInputFieldDirective,
    IsEllipsisActiveDirective,

    // Pipes
    CurrencyConverterPipe,
    SpaceCurrencyFormatterPipe,


  ],
  entryComponents: [AdvancedFilterDbDialogComponent, SharedDialogComponent],
  providers: [
    CurrencyConverterService,
    CurrencyPipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: dateFormat },
  ],
})
export class SharedModule {
}
