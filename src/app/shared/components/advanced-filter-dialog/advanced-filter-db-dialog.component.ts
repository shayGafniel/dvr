import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, MatDatepicker, MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { get } from 'lodash-es';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { FilterSelection } from '../../../common/models/common.model';
import { TimeFrame } from '../../../common/models/time-frame.model';
import { Country, Currency } from '../../../common/services/configuration/configuration.model';
import { Company } from '../../../common/services/gate/models/rails-data.model';
import {
  selectCompanies,
  selectConfiguration,
  selectFilterOptionsState,
} from '../../../common/services/store/reducers';
import { AppState } from '../../../common/store/reducers';
import { ResetMainFilters, SetMainFilters } from '../../../core/store/main-filters/main-filters.actions';
import { selectIsPristineMainFilters, selectMainFilters, State } from '../../../core/store/reducers';
import { yearMonthFormat } from '../../configurations/date.configuration';
import {
  advancedFilters,
  getAllValue,
  getCompanyAllValue,
  getCountriesAllValue,
  getCurrencyAllValue,
  getDirectivesAllValue,
  getExpenseDomainOptions,
  getExpenseDomainsAllValue,
  getExpenseTypeByOptions,
  getInvoiceDirectivesOptions,
  getReclaimDirectivesOptions,
  getSubmissionAuthorityOptions,
} from '../../configurations/filter.configuration';
import {
  defaultPaidBy,
  ExpenseTypeBy,
  FilterLabels,
  FilterPage,
  MainFilters,
  PaidBy,
} from '../../models/main-filters.model';
import { MainFiltersUtil } from '../../utils/main-filters.util';
import { MainFiltersService } from '../../../core/services/main-filters.service';

@Component({
  selector: 'app-advanced-filter-db-dialog',
  templateUrl: './advanced-filter-db-dialog.component.html',
  styleUrls: ['./advanced-filter-db-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: yearMonthFormat }],
})
export class AdvancedFilterDbDialogComponent implements OnDestroy, OnInit {
  public readonly advancedFilters = advancedFilters;
  public readonly defaultCompanies: Company[] = [getCompanyAllValue()];
  public readonly defaultCountries: Country[] = getCountriesAllValue();
  public readonly defaultCurrency: Currency[] = getCurrencyAllValue();
  public readonly defaultDirectives: FilterSelection[] = getDirectivesAllValue();
  public readonly defaultExpenseDomains: FilterSelection[] = getExpenseDomainsAllValue();
  public readonly defaultExpenseTypes: FilterSelection[] = getAllValue();
  public readonly defaultPaidBy = defaultPaidBy;
  public readonly defaultRejectedReasons: FilterSelection[] = getAllValue();
  public readonly directivesInvoicesOptions: FilterSelection[] = getInvoiceDirectivesOptions();
  public readonly directivesReclaimsOptions: FilterSelection[] = getReclaimDirectivesOptions();
  public readonly expenseDomainOptions: FilterSelection[] = getExpenseDomainOptions();
  public readonly expenseTypeByOptions: FilterSelection<
    ExpenseTypeBy
  >[] = getExpenseTypeByOptions();
  public readonly FilterLabels = FilterLabels;
  public readonly invoiceIdFormControl = new FormControl('');
  public readonly now: moment.Moment = moment();
  public readonly PaidBy = PaidBy;
  public readonly reclaimIdFormControl = new FormControl('');
  public readonly submissionAuthorityOptions: FilterSelection<
    number
  >[] = getSubmissionAuthorityOptions();

  public companiesOptions$: Observable<Company[]>;
  public countriesOptions$: Observable<Country[]>;
  public currencyOptions$: Observable<Currency[]>;
  public dateFrom: moment.Moment;
  public dateTo: moment.Moment;
  public disabledExpenseTypeBy = false;
  public expenseTypesOptions$: Observable<FilterSelection[]>;
  public filterPage: FilterPage;
  public filters: MainFilters = {};
  public isDirty$ = new BehaviorSubject<boolean>(false);
  public isPristineFilters$: Observable<boolean>;
  public rejectedReasonsOptions$: Observable<FilterSelection[]>;

  private componentDestroyed$ = new Subject();

  constructor(
    private dialogRef: MatDialogRef<AdvancedFilterDbDialogComponent>,
    private store: Store<AppState & State>,
    private mainFiltersService: MainFiltersService,
  ) {}

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  public ngOnInit(): void {
    this.setFilters();
    this.setCompaniesOptions();
    this.setCountriesOptions();
    this.setCurrencyOptions();
    this.setExpenseTypesOptions();
    this.setIsPristineFilters();
    this.setRejectedReasonsOptions();

    this.watchField('invoice_id', this.invoiceIdFormControl);
    this.watchField('reclaim_id', this.reclaimIdFormControl);
  }

  private setFilters(): void {
    this.store
      .pipe(
        select(selectMainFilters),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe(dashboardFilters => {
        this.filters = { ...dashboardFilters };
      });
  }

  private setCompaniesOptions(): void {
    this.companiesOptions$ = this.store.pipe(
      select(selectCompanies),
      map(companies => [this.defaultCompanies[0], ...companies]),
    );
  }

  private setCountriesOptions(): void {
    this.countriesOptions$ = this.store.pipe(
      select(selectConfiguration),
      map(conf => [this.defaultCountries[0], ...conf.countries]),
    );
  }

  private setCurrencyOptions(): void {
    this.currencyOptions$ = this.store.pipe(
      select(selectConfiguration),
      map(conf => [this.defaultCurrency[0], ...conf.allCurrencies]),
    );
  }

  private setExpenseTypesOptions(): void {
    this.expenseTypesOptions$ = this.store.pipe(
      select(selectFilterOptionsState),
      map(options => [this.defaultExpenseTypes[0], ...options.invoice_category]),
    );
  }

  private setIsPristineFilters(): void {
    this.isPristineFilters$ = combineLatest(
      this.store.pipe(select(selectIsPristineMainFilters)),
      this.isDirty$,
    ).pipe(map(([isPristineMainFilters, isDirty]) => isPristineMainFilters && !isDirty));
  }

  private setRejectedReasonsOptions(): void {
    this.rejectedReasonsOptions$ = this.store.pipe(
      select(selectFilterOptionsState),
      map(options => [this.defaultRejectedReasons[0], ...options.reject_reason]),
    );
  }

  private watchField(field: keyof MainFilters, formControl: FormControl): void {
    formControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(700),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe((value: string) => {
        this.setFilter(field, value || undefined);
      });

    this.store
      .pipe(
        select(selectMainFilters),
        map(filter => filter[field]),
        distinctUntilChanged(),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe(value => {
        formControl.setValue(value, { emitEvent: false });
      });
  }

  public castDatepicker(picker: MatDatepicker<any>): MatDatepicker<moment.MomentInput> {
    return picker;
  }

  public castMoment(date: moment.Moment): moment.Moment & any {
    return date;
  }

  public clear(): void {
    this.store.dispatch(new ResetMainFilters());
    this.resetFromTo();
    this.isDirty$.next(false);
  }

  public filter(): void {
    this.dispatchDashBoardFilter();
    this.closeDialog();
  }

  private dispatchDashBoardFilter(): void {
    this.store.dispatch(new SetMainFilters({ mainFilters: { ...this.filters } }));
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }

  //noinspection JSMethodCanBeStatic
  public onMonthSelected(
    normalizedMonth: moment.Moment,
    datepicker: MatDatepicker<moment.MomentInput>,
  ): void {
    datepicker.select(normalizedMonth);
    datepicker.close();
  }

  public setAmountFrom(value: string): void {
    this.setFilter('amount_from', parseInt(value, 10));
  }

  public setAmountTo(value: string): void {
    this.setFilter('amount_to', parseInt(value, 10));
  }

  public setCompanies(selectedCompanies: Company[]): void {
    this.setFilter('companies', selectedCompanies);
  }

  public setCountries(selectedCountries: Country[]): void {
    const withoutAllValue =
      get(selectedCountries, '[0].name') === this.defaultCountries[0].name
        ? null
        : selectedCountries;
    this.setFilter('countries', withoutAllValue);
  }

  public setCurrency(selectedCurrency: Currency): void {
    const withoutAllValue =
      get(selectedCurrency, 'name') === this.defaultCurrency[0].name ? null : selectedCurrency;
    this.setFilter('currency', withoutAllValue);
  }

  public setDateFrom(date: moment.Moment): void {
    this.dateFrom = date;
    this.setDateFromTo('invoiced_at_from', date);
    this.setTimeFrameAsCustom();
  }

  public setDateTo(date: moment.Moment): void {
    this.dateTo = this.convertDateToLastDayOfDate(date);
    const convertedDateToLastDayOfDate = date.endOf('month');
    this.setDateFromTo('invoiced_at_to', convertedDateToLastDayOfDate);
    this.setTimeFrameAsCustom();
  }

  //noinspection JSMethodCanBeStatic
  private convertDateToLastDayOfDate(date: moment.Moment) {
    return date.endOf('month');
  }

  private setTimeFrameAsCustom(): void {
    this.setFilter('time_frame', TimeFrame.Custom);
  }

  public setDateFromTo(dateFieldName: keyof MainFilters, dateValue: string | moment.Moment): void {
    this.setFilter(dateFieldName, dateValue && MainFiltersUtil.toTableauDate(dateValue));
  }

  public setDirectivesInvoices(selectedDirectives: FilterSelection[]): void {
    const withoutAllValue =
      get(selectedDirectives, '[0].value') === this.defaultDirectives[0].value
        ? null
        : selectedDirectives;

    let reclaimDirectives;
    if (withoutAllValue) {
      reclaimDirectives = this.mainFiltersService
        .mapDirectives(withoutAllValue, 'reclaims');
    }
    this.setFilter('directives_invoices', withoutAllValue);
    this.setFilter('directives_reclaims', reclaimDirectives);
  }

  public setDirectivesReclaims(selectedDirectives: FilterSelection[]): void {
    const withoutAllValue =
      get(selectedDirectives, '[0].value') === this.defaultDirectives[0].value
        ? null
        : selectedDirectives;

    let invoicesDirective;
    if (withoutAllValue) {
      invoicesDirective = this.mainFiltersService
        .mapDirectives(withoutAllValue);
    }
    this.setFilter('directives_invoices', invoicesDirective);
    this.setFilter('directives_reclaims', withoutAllValue);
  }

  public setExpenseDomains(selectedExpenseDomains: FilterSelection[]): void {
    const withoutAllValue =
      get(selectedExpenseDomains, '[0].value') === this.defaultExpenseDomains[0].value
        ? null
        : selectedExpenseDomains;
    this.setFilter('expense_domains', withoutAllValue);
  }

  public setExpenseTypes(selectedExpenseTypes: FilterSelection[]): void {
    const withoutAllValue =
      get(selectedExpenseTypes, '[0].value') === this.defaultExpenseTypes[0].value
        ? null
        : selectedExpenseTypes;
    this.setFilter('expense_types', withoutAllValue);
  }

  public setExpenseTypeBy(selectedExpenseTypeBy: ExpenseTypeBy): void {
    this.setFilter('expense_type_by', selectedExpenseTypeBy);
  }

  public setInvoiceNumber(value: string): void {
    this.setFilter('invoice_number', value);
  }

  public setOriginCountries(selectedOriginCountries: Country[]): void {
    const withoutAllValue =
      get(selectedOriginCountries, '[0].name') === this.defaultCountries[0].name
        ? null
        : selectedOriginCountries;
    this.setFilter('origin_countries', withoutAllValue);
  }

  public setPaidBy(value: PaidBy | string): void {
    this.setFilter('paid_by', value === defaultPaidBy ? null : value);
  }

  public setReportNumber(value: string): void {
    this.setFilter('report_number', value);
  }

  public setRejectedReasons(selectedRejectedReasons: FilterSelection[]): void {
    const withoutAllValue =
      get(selectedRejectedReasons, '[0].value') === this.defaultRejectedReasons[0].value
        ? null
        : selectedRejectedReasons;
    this.setFilter('reject_reasons', withoutAllValue);
  }

  public setSubmissionAuthority(selectedSubmissionAuthority: number[]): void {
    this.setFilter('submission_authority', selectedSubmissionAuthority);
  }

  public setTimeFrame(selectedTimeFrame: TimeFrame): void {
    this.resetTimeFrame();
    this.setFilter('time_frame', selectedTimeFrame);
  }

  private resetTimeFrame(): void {
    this.setDateFromTo('invoiced_at_from', null);
    this.setDateFromTo('invoiced_at_to', null);
    this.resetFromTo();
  }

  private resetFromTo(): void {
    this.dateFrom = null;
    this.dateTo = null;
  }

  private setFilter(filterName: keyof MainFilters, value: any = null): void {
    this.isDirty$.next(true);

    if (value === null) {
      delete this.filters[filterName];
    } else {
      this.filters[filterName as string] = value;
    }
  }
}
