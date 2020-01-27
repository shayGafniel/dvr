import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  ConfigurationAPIService,
  ConfigurationResponse,
} from '../../services/configuration/configuration-api.service';
import { Country } from '../../services/configuration/configuration.model';

@Pipe({ name: 'country', pure: false })
export class CountryCodePipe implements PipeTransform {
  private currentCountry: BehaviorSubject<Country> = new BehaviorSubject(undefined);

  constructor(private _confService: ConfigurationAPIService) {}

  public transform(value: string): Country {
    const self = this;
    this.getCountry(value).subscribe(
      (country: Country) => {
        self.currentCountry.next(country);
      },
      () => {
        self.currentCountry.next(undefined);
      },
    );
    return this.currentCountry.getValue();
  }

  public getCountry(code: string): Observable<Country> {
    return this._confService.responseObserver().pipe(
      mergeMap((confResponse: ConfigurationResponse) => {
        return of(confResponse.config.countryByCode(code));
      }),
    );
  }
}
