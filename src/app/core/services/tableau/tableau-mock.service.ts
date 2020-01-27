import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '~/common/store/reducers';
import { MainFiltersService } from '../main-filters.service';
import { State } from '../../store/reducers';
import { TableauApiService } from './tableau-api.service';
import { TableauUrl } from './tableau.configuration';
import { TableauService } from './tableau.service';

@Injectable()
export class TableauMockService extends TableauService {
  constructor(
    protected mainFiltersService: MainFiltersService,
    protected store: Store<AppState & State>,
    protected tableauApiService: TableauApiService,
  ) {
    super(mainFiltersService, store, tableauApiService);
  }

  public watchMainFilters(tableauUrl: TableauUrl, until: Observable<any>): void {}
}
