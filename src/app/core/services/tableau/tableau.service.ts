/// <reference types="tableau" />

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { isArray, isNil } from 'lodash-es';
import * as moment from 'moment';
import { merge, Observable, Subject } from 'rxjs';
import {
  bufferWhen,
  map,
  skipUntil,
  take,
  takeUntil,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { AppState } from '~/common/store/reducers';
import { MainFiltersService } from '../main-filters.service';
import { MainFilters, MainFiltersKey } from '~/shared/models/main-filters.model';
import {
  resetFilters,
  TableauDateRange,
  TableauFilterKey,
  TableauFilters,
  TableauOptions,
  TableauSheet,
  TableauValue,
} from '~/shared/models/tableau.model';
import { CommonUtil } from '~/shared/utils/common.util';
import { TableauUtil } from '~/shared/utils/tableau.util';
import { selectPreparedInvoicedAt, State } from '../../store/reducers';
import { TableauApiService } from './tableau-api.service';
import { tableauHost, TableauUrl } from './tableau.configuration';

@Injectable()
export class TableauService {
  public static readonly tableauSelector = '.tableau-viz';

  private applyInvoicedAt$ = new Subject();
  private tableauViz: tableau.Viz;
  private isReady$ = new Subject();

  constructor(
    protected mainFiltersService: MainFiltersService,
    protected store: Store<AppState & State>,
    protected tableauApiService: TableauApiService,
  ) {}

  public watchMainFilters(tableauUrl: TableauUrl, until: Observable<any>): void {
    this.tableauApiService.getTableauTicket().subscribe(({ key }) => {
      this.getDefaultFilters().subscribe(defaultFilters => {
        this.subscribeOnApplyingInvoicedAt(until);
        this.resetOnUntil(until);
        this.subscribeOnMainFilters(until);
        this.initTableau(tableauUrl, key, defaultFilters);
      });
    });
  }

  private getDefaultFilters(): Observable<TableauFilters> {
    return this.mainFiltersService.getDefaultFilters().pipe(
      map(filters => {
        return Object.entries(filters).reduce(
          (options: TableauFilters, [key, value]: [MainFiltersKey, any]) => {
            const tableauKey = TableauUtil.getTableauKey(key);
            options[tableauKey] = TableauUtil.getTableauValue(key, value);

            return options;
          },
          {} as TableauFilters,
        );
      }),
    );
  }

  private initTableau(
    tableauUrl: TableauUrl,
    tableauKey: string,
    defaultFilters: TableauFilters,
  ): void {
    const placeholderElement = this.getPlaceholderElement();
    const url = `${tableauHost}/trusted/${tableauKey}/views/${tableauUrl}`;
    const options = this.getOptions(defaultFilters);
    this.tableauViz = new tableau.Viz(placeholderElement, url, options);
  }

  //noinspection JSMethodCanBeStatic
  private getPlaceholderElement(): HTMLElement {
    const hostElement = document.querySelector(TableauService.tableauSelector) as HTMLElement;

    if (!hostElement) {
      throw new Error(`Element "${TableauService.tableauSelector}" was not found`);
    }

    return hostElement;
  }

  private getOptions(defaultFilters: TableauFilters): TableauOptions {
    return {
      hideTabs: true,
      hideToolbar: true,
      width: '100%',
      height: '100%',
      ...resetFilters,
      ...CommonUtil.clearObject(defaultFilters),
      onFirstInteractive: () => this.tableauIsReady(),
    };
  }

  private tableauIsReady(): void {
    this.isReady$.next();
    this.isReady$.complete();

    this.applyInvoicedAt$.next();
  }

  private subscribeOnApplyingInvoicedAt(until: Observable<any>): void {
    this.applyInvoicedAt$
      .pipe(
        takeUntil(until),
        throttleTime(100),
        withLatestFrom(this.store.pipe(select(selectPreparedInvoicedAt))),
        map(([, invoicedAt]) => invoicedAt),
      )
      .subscribe(invoicedAt => {
        this.applyDateRangeFilter({
          min: moment.utc(invoicedAt.invoiced_at_from).toDate(),
          max: moment.utc(invoicedAt.invoiced_at_to).toDate(),
        });
      });
  }

  private resetOnUntil(until: Observable<any>): void {
    until.subscribe(() => {
      this.isReady$ = new Subject();
    });
  }

  private subscribeOnMainFilters(until: Observable<any>): void {
    merge(this.getChangesBeforeReady(), this.getChangesAfterReady())
      .pipe(takeUntil(until))
      .subscribe((filtersChanges: MainFilters | any) => {
        if (isArray(filtersChanges)) {
          this.filterByManyChanges(filtersChanges);
        } else {
          this.filterByChanges(filtersChanges);
        }
      });
  }

  private getChangesBeforeReady(): Observable<MainFilters[]> {
    return this.mainFiltersService.preparedMainFiltersChanges$.pipe(
      bufferWhen(() => this.isReady$),
      take(1),
    );
  }

  private getChangesAfterReady(): Observable<MainFilters> {
    return this.mainFiltersService.preparedMainFiltersChanges$.pipe(skipUntil(this.isReady$));
  }

  private filterByManyChanges(filtersChanges: MainFilters[]): void {
    if (filtersChanges.length) {
      const filtersChangesBeforeReady: MainFilters = Object.assign({}, ...filtersChanges);
      this.filterByChanges(filtersChangesBeforeReady);
    }
  }

  private filterByChanges(filtersChanges: MainFilters): void {
    Object.entries(filtersChanges).forEach(([key, value]: [MainFiltersKey, any]) =>
      this.handleChange(key, value),
    );
  }

  private handleChange(key: MainFiltersKey, value: any): void {
    if (!TableauUtil.getTableauKey(key)) {
      return;
    }

    if (TableauUtil.getTableauParamsKey(key)) {
      this.applyParameterWithMainFilterKey(key, value);
    } else {
      this.filterWithMainFilterKey(key, value);
    }
  }

  private applyParameterWithMainFilterKey(key: MainFiltersKey, value: any): void {
    const tableauKey = TableauUtil.getTableauParamsKey(key);
    const tableauValue = TableauUtil.getTableauValue(key, value);

    this.tableauViz.getWorkbook().changeParameterValueAsync(tableauKey, tableauValue);
  }

  private filterWithMainFilterKey(key: MainFiltersKey, value: any): void {
    const tableauKey = TableauUtil.getTableauFiltersKey(key);
    const tableauValue = TableauUtil.getTableauValue(key, value);

    switch (true) {
      case isNil(tableauValue):
        this.clearFilter(tableauKey);
        break;

      case key === 'invoiced_at_from' || key === 'invoiced_at_to':
        this.applyInvoicedAt$.next();
        break;

      default:
        this.applyFilter(tableauKey, tableauValue);
    }
  }

  private applyFilter(key: TableauFilterKey, value: TableauValue): void {
    this.getWorkSheets().forEach(worksheet => {
      worksheet.applyFilterAsync(key, value as any, tableau.FilterUpdateType.REPLACE);
    });
  }

  private applyDateRangeFilter(
    dateRange: TableauDateRange,
    key = TableauFilterKey.InvoicedAt,
  ): void {
    this.getWorkSheets().forEach(worksheet => {
      worksheet.applyRangeFilterAsync(key, {
        ...dateRange,
        nullOption: undefined,
      });
    });
  }

  private clearFilter(key: TableauFilterKey): void {
    this.getWorkSheets().forEach(worksheet => {
      worksheet.clearFilterAsync(key);
    });
  }

  private getWorkSheets(): tableau.Worksheet[] {
    const sheet = this.tableauViz.getWorkbook().getActiveSheet() as TableauSheet;

    return sheet.getWorksheets();
  }
}
