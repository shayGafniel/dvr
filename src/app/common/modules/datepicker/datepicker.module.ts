import { ComponentFactoryResolver, Injector, NgModule } from '@angular/core';

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import {
  MatCalendar,
  MatCalendarBody,
  MatCalendarHeader,
  MatDatepicker,
  MatDatepickerContent,
  MatDatepickerModule,
  MatDatepickerToggle,
  MatMonthView,
} from '@angular/material/datepicker';

import { VbDatepickerComponent } from './datepicker/datepicker.component';
import { VbDatepickerInputDirective } from './datepicker/datepicker-input.directive';
import { VbDatepickerContentComponent } from './datepicker-content/datepicker-content.component';
import { CommonModule } from '@angular/common';
import { VbCalendarComponent } from './calendar/calendar.component';
import { VbMonthViewComponent } from './month-view/month-view.component';
import { VbCalendarBodyComponent } from './calendar-body/calendar-body.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    A11yModule,
    PortalModule,
    OverlayModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    VbDatepickerComponent,
    VbDatepickerInputDirective,
    VbDatepickerContentComponent,
    VbCalendarComponent,
    VbMonthViewComponent,
    VbCalendarBodyComponent,
  ],
  exports: [
    MatDatepickerModule,
    VbDatepickerComponent,
    VbDatepickerInputDirective,
    VbDatepickerContentComponent,
  ],
  entryComponents: [
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerContent,
    MatCalendar,
    MatMonthView,
    MatCalendarBody,
    MatCalendarHeader,
    VbDatepickerContentComponent,
  ],
})
export class VbDatepickerModule {
  constructor(cf: ComponentFactoryResolver, injector: Injector) {
    // this is a workaround to ensure CSS/HTML from mat datepicker is loaded, otherwise it is omitted.
    cf.resolveComponentFactory(MatDatepicker).create(injector);
    cf.resolveComponentFactory(MatDatepickerContent).create(injector);
    cf.resolveComponentFactory(MatCalendar).create(injector);
    cf.resolveComponentFactory(MatMonthView).create(injector);
    cf.resolveComponentFactory(MatCalendarBody).create(injector);
    cf.resolveComponentFactory(MatDatepickerToggle).create(injector);
  }
}
