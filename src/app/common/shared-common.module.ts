import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NguCarouselModule} from '@ngu/carousel';
import {DndModule} from 'ng2-dnd';
import {DragulaModule} from 'ng2-dragula';
import {NgrxFormsModule} from 'ngrx-forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import {ActionCarouselComponent} from './components/action-carousel/action-carousel.component';
import {CommentPopupComponent} from './components/comment-popup/comment-popup.component';
import {DialogContainerComponent} from './components/common-dialog/container/dialog-container.component';
import {ConfirmDialogComponent} from './components/common-dialog/types/confirm-dialog.component';
import {ErrorDialogComponent} from './components/common-dialog/types/error-dialog.component';
import {EditableTableComponent} from './components/tables/editable-table/editable-table.component';
import {InfoDialogComponent} from './components/common-dialog/types/info-dialog.component';
import {FetchingInvoiceComponent} from './components/fetching-invoice/fetching-invoice.component';
import {ImageViewerComponent} from './components/image-viewer/image-viewer.component';
import {ImgMapComponent} from './components/img-map/img-map.component';
import {LoadIndicatorComponent} from './components/load-indicator/load-indicator.component';
import {BuildMailInstructionComponent} from './components/mail-support-dialog/build-mail-instructions.component';
import {MailValidationComponent} from './components/mail-support-dialog/mail-validation.component';
import {RequestDescriptionComponent} from './components/mail-support-dialog/request-description.component';
import {MultiSelectAllComponent} from './components/multi-select-all/multi-select-all.component';
import {MultiSelectOrderComponent} from './components/multi-select-order/multi-select-order.component';
import {ResponsiveRotatableImageComponent} from './components/responsive-rotatable-image/responsive-rotatable-image.component';
import {SVGImageComponent} from './components/svg-image.component';
import {SnackbarComponent} from './components/snack-bar/snack-bar.component';
import {CustomizeTableCellComponent} from './components/tables/customize-table-cell/customize-table-cell.component';
import {ToastComponent} from './components/toast/toast.component';
import {ToolTipPopUpComponent} from './components/tool-tip-pop-up/tool-tip-pop-up.component';
import {VendorAutocompleteComponent} from './components/vendor-autocomplete/vendor-autocomplete.component';

import {SupportDialogComponent} from './services/error-handler/dialog/support/support-dialog.component';

import {AutoSelectDirective} from './directives/auto-select.directive';
import {DisableControlDirective} from './directives/disable-control.directive';
import {DisableMouseWheelDirective} from './directives/disable-mousewheel.directive';
import {DraggableDirective} from './directives/draggable.directive';
import {Draggable2Directive} from './directives/draggable2.directive';
import {ErrorStateMatcherDirective} from './directives/error-state-matcher.directive';
import {ImageFallbackDirective} from './directives/image-fallback.directive';
import {NgrxMatSelectValueAccessor} from './directives/mat-select-value-accessor.directive';
import {MaxFitHeightDirective} from './directives/max-fit-height.directive';
import {ScrollParentDirective} from './directives/scroll-parent.directive';
import {TableCardInputDirective} from './directives/table-card-input.directive';
import {TransformerDirective} from './directives/transformer/transformer.directive';
import {TruncateDirective} from './directives/truncate.directive';

import {MaterialModule} from '../shared/material.module';

import {VbDatepickerModule} from './modules/datepicker/datepicker.module';

import {AbbreviateNumberPipe} from './pipes/abbreviate-number/abbreviate-number.pipe';
import {CategoryIdPipe} from './pipes/configuration/category-by-id.pipe';
import {CategoryGroupPipe} from './pipes/configuration/category-group.pipe';
import {CountryCodePipe} from './pipes/configuration/country-code.pipe';
import {ProvinceCodePipe} from './pipes/configuration/province-code.pipe';
import {CurrencyByCodePipe} from './pipes/currency-by-code.pipe';
import {ImaginaryPipe} from './pipes/imaginary/imaginary.pipe';
import {NormalizeDdmmyyyyDate} from './pipes/normalize-ddmmyy-date.pipe';
import {OrderByPipe} from './pipes/order-by/order-by.pipe';
import {TimeFrameComponent} from './components/time-frame/time-frame.component';
import {CustomizeAutoCompleteComponent} from './components/customize-auto-complete/customize-auto-complete.component';
import {OnlyPositiveNumberDirective} from './directives/only-positive-number.directive';

@NgModule({
  declarations: [
    // Components
    ActionCarouselComponent,
    BuildMailInstructionComponent,
    CommentPopupComponent,
    ConfirmDialogComponent,
    CustomizeTableCellComponent,
    DialogContainerComponent,
    EditableTableComponent,
    ErrorDialogComponent,
    FetchingInvoiceComponent,
    ImageViewerComponent,
    ImgMapComponent,
    InfoDialogComponent,
    LoadIndicatorComponent,
    MailValidationComponent,
    MultiSelectAllComponent,
    MultiSelectOrderComponent,
    RequestDescriptionComponent,
    ResponsiveRotatableImageComponent,
    SupportDialogComponent,
    SVGImageComponent,
    SnackbarComponent,
    ToastComponent,
    ToolTipPopUpComponent,
    VendorAutocompleteComponent,

    // Directives
    AutoSelectDirective,
    DisableControlDirective,
    DisableMouseWheelDirective,
    Draggable2Directive,
    DraggableDirective,
    ErrorStateMatcherDirective,
    ImageFallbackDirective,
    MaxFitHeightDirective,
    NgrxMatSelectValueAccessor,
    OnlyPositiveNumberDirective,
    ScrollParentDirective,
    TableCardInputDirective,
    TransformerDirective,
    TruncateDirective,

    // Pipes
    AbbreviateNumberPipe,
    CategoryGroupPipe,
    CategoryIdPipe,
    CountryCodePipe,
    CurrencyByCodePipe,
    ImaginaryPipe,
    NormalizeDdmmyyyyDate,
    OrderByPipe,
    ProvinceCodePipe,
    TimeFrameComponent,
    CustomizeAutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    DndModule,
    DragulaModule,
    FlexLayoutModule,
    FormsModule,
    InfiniteScrollModule,
    MaterialModule,
    NgrxFormsModule,
    NguCarouselModule,
    ReactiveFormsModule,
    VbDatepickerModule,
  ],
  exports: [
    // Modules
    CommonModule,
    DndModule,
    DragulaModule,
    FlexLayoutModule,
    FormsModule,
    InfiniteScrollModule,
    MaterialModule,
    NgrxFormsModule,
    NguCarouselModule,
    ReactiveFormsModule,
    VbDatepickerModule,

    // Components
    ActionCarouselComponent,
    BuildMailInstructionComponent,
    CommentPopupComponent,
    ConfirmDialogComponent,
    CustomizeAutoCompleteComponent,
    CustomizeTableCellComponent,
    DialogContainerComponent,
    EditableTableComponent,
    ErrorDialogComponent,
    FetchingInvoiceComponent,
    ImageViewerComponent,
    ImgMapComponent,
    InfoDialogComponent,
    LoadIndicatorComponent,
    MailValidationComponent,
    MultiSelectAllComponent,
    MultiSelectOrderComponent,
    RequestDescriptionComponent,
    ResponsiveRotatableImageComponent,
    SupportDialogComponent,
    SVGImageComponent,
    SnackbarComponent,
    ToastComponent,
    ToolTipPopUpComponent,
    VendorAutocompleteComponent,

    // Directives
    AutoSelectDirective,
    DisableControlDirective,
    DisableMouseWheelDirective,
    Draggable2Directive,
    DraggableDirective,
    ErrorStateMatcherDirective,
    ImageFallbackDirective,
    MaxFitHeightDirective,
    NgrxMatSelectValueAccessor,
    OnlyPositiveNumberDirective,
    ScrollParentDirective,
    TableCardInputDirective,
    TransformerDirective,
    TruncateDirective,

    // Pipes
    AbbreviateNumberPipe,
    CategoryGroupPipe,
    CategoryIdPipe,
    CountryCodePipe,
    CurrencyByCodePipe,
    ImaginaryPipe,
    NormalizeDdmmyyyyDate,
    OrderByPipe,
    ProvinceCodePipe,
    TimeFrameComponent,
  ],
  entryComponents: [
    ActionCarouselComponent,
    BuildMailInstructionComponent,
    ConfirmDialogComponent,
    ErrorDialogComponent,
    InfoDialogComponent,
    MailValidationComponent,
    RequestDescriptionComponent,
    SupportDialogComponent,
    SnackbarComponent,
  ],
})
export class SharedCommonModule {
}
