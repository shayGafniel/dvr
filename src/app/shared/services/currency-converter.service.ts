import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppState } from '../../common/store/reducers';
import { SetCurrencyAndRate } from '../../core/store/main-filters/main-filters.actions';
import { selectPreparedInvoicedAt } from '../../core/store/reducers';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  public static VATBOX_SERVICE_NAME = 'currency-convertor';
  public static API_BASE = `/api/${CurrencyConverterService.VATBOX_SERVICE_NAME}/v1.0/rate`;
  public url: string;
  public rate;
  private myServiceUri: Subject<string>;
  private rateObs: Subject<number> = new Subject();
  private currencySub: Subscription;
  private currencyCode: string;

  constructor(private http: HttpClient,
              private store: Store<AppState>,
  ) {
    // In order to cancel unneeded req of rate used switchMap
    this.myServiceUri = new Subject();
    this.myServiceUri.pipe(
      switchMap((url) => this.http.get(url)),
    ).subscribe((rate: number) => {
      this.store.dispatch(new SetCurrencyAndRate({
        currencyCode: this.currencyCode, rate: rate
      }));
      this.rateObs.next(rate);
    });
  }

  public getCurrencyRate(code, dateFrom, dateTo) {
    const url = `${CurrencyConverterService.API_BASE}?dateFrom=${dateFrom}&dateTo=${dateTo}&currency=${code}`;
    if (this.url !== url) {
      this.url = url;
      this.myServiceUri.next(url);
    }
    return this.rateObs;
  }

  // Todo Shalom ask Denis P to change date format at rate service -- remove the moment formatting
  public setCurrency(currency: string) {
    this.currencyCode = currency;
    if (!!this.currencySub) this.currencySub.unsubscribe();
    this.currencySub = this.store.pipe(
      select(selectPreparedInvoicedAt)
    ).subscribe((date) =>
      this.getCurrencyRate(
        currency,
        moment(date.invoiced_at_from).format('DD-MM-YYYY'),
        moment(date.invoiced_at_to).format('DD-MM-YYYY'),
      )
    );
  }
}
