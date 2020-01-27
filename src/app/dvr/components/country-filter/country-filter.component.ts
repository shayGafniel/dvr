import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MultiSelectOption } from '../../../common/models/multy-select.model';
import * as fromRefundFilterForm from '../../store/refund-filter-form/refund-filter-form.reducer';

@Component({
  selector: 'app-country-filter',
  templateUrl: './country-filter.component.html',
  styleUrls: ['./country-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryFilterComponent implements OnChanges, OnInit {
  private readonly countryOptions$ = new BehaviorSubject<MultiSelectOption[]>([]);

  @Input()
  public countryFilter: string;
  @Input()
  public countryOptions: MultiSelectOption[];
  @Input()
  public formState: fromRefundFilterForm.State;

  @Output()
  public countryFilterChange = new EventEmitter<string>();

  public filteredCountryOptions$ = this.countryOptions$.asObservable();

  constructor() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['countryFilter'] || changes['countryOptions']) {
      this.fillCountryOptions();
    }
  }

  private fillCountryOptions(): void {
    this.countryOptions$.next(
      this.countryOptions.filter(option =>
        option.display.toLowerCase().includes(this.countryFilter.trim().toLowerCase()),
      ),
    );
  }

  public ngOnInit() {}

  // noinspection JSMethodCanBeStatic
  public displayCountry(country: MultiSelectOption): string {
    return country.display;
  }

  public onCountryInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.countryFilterChange.emit(inputEl.value);
  }
}
