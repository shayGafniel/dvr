import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseApi } from '../base-api';
import { WorkEntity } from '../../models/work-dispatcher.model';

export abstract class WorkEntitiesApiService extends BaseApi {
  protected abstract getWorkEntitiesMap: (...rest: any) => WorkEntity[];
  protected abstract getWorkEntitiesApi: string;

  constructor(protected http: HttpClient) {
    super(http);
  }

  public getWorkEntities(): Observable<WorkEntity[]> {
    return this.http.get<any>(this.getWorkEntitiesApi).pipe(map(this.getWorkEntitiesMap));
  }

  public abstract updateWorkEntities(entitiesIds: string[]): Observable<any>;
}
