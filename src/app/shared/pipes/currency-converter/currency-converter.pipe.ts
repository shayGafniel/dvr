import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from '../../../common/store/reducers';
import { selectRate } from '../../../core/store/reducers';
import { State } from '../../../dashboard/store/reducers';

@Pipe({
  name: 'currencyConverter',
})
export class CurrencyConverterPipe implements PipeTransform {
  constructor(private store: Store<AppState & State>) {}

  public transform(value: any, args?: any): Observable<number> {
    return this.store.pipe(select(selectRate), map(rate => (value && rate ? value * rate : 0)));
  }
}
