import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  ConfigurationAPIService,
  ConfigurationResponse,
} from '../services/configuration/configuration-api.service';
import { Currency } from '../services/configuration/configuration.model';

@Pipe({ name: 'currencyByCode', pure: false })
export class CurrencyByCodePipe implements PipeTransform {
  private currency: BehaviorSubject<Currency> = new BehaviorSubject<Currency>(undefined);

  constructor(private _confService: ConfigurationAPIService) {}

  public transform(value: string): Currency {
    this.getCurrency(value).subscribe(
      (currency: Currency) => {
        this.currency.next(currency);
      },
      () => {
        this.currency.next(undefined);
      },
    );
    return this.currency.getValue();
  }

  private getCurrency(code: string): Observable<Currency> {
    return this._confService.responseObserver().pipe(
      mergeMap((confResponse: ConfigurationResponse) => {
        return of(confResponse.config.currencyByCode(code));
      }),
    );
  }
}
