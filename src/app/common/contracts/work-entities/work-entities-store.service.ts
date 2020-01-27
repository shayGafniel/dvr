import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { share, startWith, switchMap, tap } from 'rxjs/operators';

import { selectMatcherWorkEntities, State } from '../../services/store/reducers';
import { WorkEntity } from '../../models/work-dispatcher.model';
import { muteFirst } from '../../utils/utils';
import { AppState } from '../../store/reducers';
import { WorkEntitiesApiService } from './work-entities-api.service';
import {
  GetWorkEntities,
  GetWorkEntitiesFail,
  GetWorkEntitiesSuccess,
  LoadWorkEntities,
  UpdateWorkEntities,
  UpdateWorkEntitiesFail,
  UpdateWorkEntitiesSuccess,
} from './work-entities.actions';

export abstract class WorkEntitiesStoreService {
  public readonly requireWorkEntities$: Observable<WorkEntity[]> = of(null).pipe(
    tap(() => this.store.dispatch(new GetWorkEntities(this.group))),
    switchMap(() => this.api.getWorkEntities()),
    tap(
      (workEntities: WorkEntity[]) => {
        this.store.dispatch(new GetWorkEntitiesSuccess(this.group));
        this.store.dispatch(new LoadWorkEntities(this.group, { workEntities }));
      },
      error => this.store.dispatch(new GetWorkEntitiesFail(this.group, error)),
    ),
  );

  public readonly workEntities$: Observable<WorkEntity[]> = muteFirst(
    this.requireWorkEntities$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(this.selectors.workEntities)),
  );

  constructor(
    protected api: WorkEntitiesApiService,
    protected store: Store<AppState & State>,
    protected readonly selectors: {
      workEntities: typeof selectMatcherWorkEntities;
    },
    protected group: string,
  ) {}

  public updateWorkEntity(entitiesIds: string[]): Observable<void> {
    return of(null).pipe(
      tap(() => this.store.dispatch(new UpdateWorkEntities(this.group))),
      switchMap(() => this.api.updateWorkEntities(entitiesIds)),
      tap(
        () => {
          this.store.dispatch(new UpdateWorkEntitiesSuccess(this.group));
        },
        error => this.store.dispatch(new UpdateWorkEntitiesFail(this.group, error)),
      ),
    );
  }
}
