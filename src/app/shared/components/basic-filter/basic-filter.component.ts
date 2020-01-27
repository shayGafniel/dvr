import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { get } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { AdvancedFilterDbDialogComponent } from '../advanced-filter-dialog/advanced-filter-db-dialog.component';
import { FilterSelection } from '../../../common/models/common.model';
import { TimeFrame } from '../../../common/models/time-frame.model';
import { Country } from '../../../common/services/configuration/configuration.model';
import { Company } from '../../../common/services/gate/models/rails-data.model';
import { selectCompanies, selectConfiguration } from '../../../common/services/store/reducers';
import { AppState } from '../../../common/store/reducers';
import {
  ResetMainFilters,
  SetTimeFrame,
  UpdateMainFilters,
} from '../../../core/store/main-filters/main-filters.actions';
import { selectMainFilters, selectMainFiltersCount, State } from '../../../core/store/reducers';
import {
  basicFilters,
  getCompanyAllValue,
  getCountriesAllValue,
  getDirectivesAllValue,
  getExpenseTypeByOptions,
  getInvoiceDirectivesOptions,
  getReclaimDirectivesOptions,
} from '../../configurations/filter.configuration';
import {
  ExpenseTypeBy,
  FilterPage,
  MainFilters,
  FilterLabels,
} from '../../models/main-filters.model';
import { MainFiltersService } from '../../../core/services/main-filters.service';

@Component({
  selector: 'app-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.scss'],
})
export class BasicFilterComponent implements OnDestroy, OnInit {
  public readonly basicFilters = basicFilters;
  public readonly defaultCompanies: Company[] = [getCompanyAllValue()];
  public readonly defaultCountries: Country[] = getCountriesAllValue();
  public readonly defaultDirectives: FilterSelection[] = getDirectivesAllValue();
  public readonly directivesInvoicesOptions: FilterSelection[] = getInvoiceDirectivesOptions();
  public readonly directivesReclaimsOptions: FilterSelection[] = getReclaimDirectivesOptions();
  public readonly expenseTypeByOptions = getExpenseTypeByOptions();
  public readonly FilterLabels = FilterLabels;
  public readonly invoiceIdFormControl = new FormControl('');
  public readonly reclaimIdFormControl = new FormControl('');

  public companiesOptions$: Observable<Company[]>;
  public countriesOptions$: Observable<Country[]>;
  public mainFilters$: Observable<MainFilters>;
  public mainFiltersCount$: Observable<number>;

  @Input()
  public disabledExpenseTypeBy = false;
  @Input()
  public filterPage: FilterPage;

  private componentDestroyed$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState & State>,
    private mainFiltersService: MainFiltersService
  ) {}

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  public ngOnInit(): void {
    this.setCompaniesOptions();
    this.setCountriesOptions();

    this.mainFilters$ = this.store.pipe(select(selectMainFilters));
    this.mainFiltersCount$ = this.store.pipe(select(selectMainFiltersCount(this.filterPage)));

    this.watchField('invoice_id', this.invoiceIdFormControl);
    this.watchField('reclaim_id', this.reclaimIdFormControl);
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

  public openAdvancedFilterDialog(): void {
    const dialogRef = this.dialog.open(AdvancedFilterDbDialogComponent, {
      maxWidth: '700px',
      panelClass: 'form-dialog',
      width: '98%',
    });
    dialogRef.componentInstance.disabledExpenseTypeBy = this.disabledExpenseTypeBy;
    dialogRef.componentInstance.filterPage = this.filterPage;
  }

  public resetFilter(): void {
    this.store.dispatch(new ResetMainFilters());
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

    this.updateFiilters(
      {
        directives_invoices: withoutAllValue,
        directives_reclaims: reclaimDirectives,
      }
    );
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
    this.updateFiilters(
      {
        directives_invoices: invoicesDirective,
        directives_reclaims: withoutAllValue,
      }
    );
  }

  public setCompanies(companies): void {
    this.setFilter('companies', companies);
  }

  public setCountries(selectedCountries: Country[]): void {
    const withoutAllValue =
      get(selectedCountries, '[0].name') === this.defaultCountries[0].name
        ? null
        : selectedCountries;
    this.setFilter('countries', withoutAllValue);
  }

  public setExpenseTypeBy(expenseTypeBy: ExpenseTypeBy): void {
    this.setFilter('expense_type_by', expenseTypeBy);
  }

  public setTimeFrame(time_frame: TimeFrame): void {
    this.store.dispatch(new SetTimeFrame({ time_frame }));
  }

  private setFilter(key: keyof MainFilters, value: any): void {
    this.store.dispatch(new UpdateMainFilters({ [key]: value }));
  }

  private updateFiilters(filters: MainFilters): void {
    this.store.dispatch(new UpdateMainFilters(filters));
  }
}
