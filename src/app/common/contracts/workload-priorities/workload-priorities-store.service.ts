import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { share, startWith, switchMap, tap } from 'rxjs/operators';

import { selectExpediteWorkloadPriorities, State } from '../../services/store/reducers';
import { WorkloadPrioritiesResponse, WorkloadPriority } from '../../models/work-dispatcher.model';
import { muteFirst } from '../../utils/utils';
import { AppState } from '../../store/reducers';
import { WorkloadPrioritiesApiService } from './workload-priorities-api.service';
import {
  GetWorkloadPriorities,
  GetWorkloadPrioritiesFail,
  GetWorkloadPrioritiesSuccess,
  LoadWorkloadPriorities,
  UpdateWorkloadPriorities,
  UpdateWorkloadPrioritiesFail,
  UpdateWorkloadPrioritiesSuccess,
} from './workload-priorities.actions';

export abstract class WorkloadPrioritiesStoreService {
  public readonly requireWorkloadPriorities$: Observable<WorkloadPriority[]> = of(null).pipe(
    tap(() => this.store.dispatch(new GetWorkloadPriorities(this.group))),
    switchMap(() => {
      const station: string = this.group === 'P2Expert' ? 'P2' : undefined;
      return this.api.getWorkloadPriorities(station);
    }),
    tap(
      (workloadPriorities: WorkloadPriority[]) => {
        this.store.dispatch(new GetWorkloadPrioritiesSuccess(this.group));
        this.store.dispatch(new LoadWorkloadPriorities(this.group, { workloadPriorities }));
      },
      error => this.store.dispatch(new GetWorkloadPrioritiesFail(this.group, error)),
    ),
  );

  public readonly workloadPriorities$: Observable<WorkloadPriority[]> = muteFirst(
    this.requireWorkloadPriorities$.pipe(
      share(),
      startWith(null),
    ),
    this.store.pipe(select(this.selectors.workloadPriorities)),
  );

  constructor(
    protected api: WorkloadPrioritiesApiService,
    protected store: Store<AppState & State>,
    protected readonly selectors: {
      workloadPriorities: typeof selectExpediteWorkloadPriorities;
    },
    protected group: string,
  ) {}

  public updateWorkloadPriority(
    workloadPrioritiesResponse: WorkloadPrioritiesResponse,
  ): Observable<void> {
    return of(null).pipe(
      tap(() => this.store.dispatch(new UpdateWorkloadPriorities(this.group))),
      switchMap(() => this.api.updateWorkloadPriorityCall(workloadPrioritiesResponse)),
      tap(
        () => {
          this.store.dispatch(new UpdateWorkloadPrioritiesSuccess(this.group));
        },
        error => this.store.dispatch(new UpdateWorkloadPrioritiesFail(this.group, error)),
      ),
    );
  }
}
