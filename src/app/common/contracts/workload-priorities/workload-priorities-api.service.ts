import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseApi } from '../base-api';
import { WorkloadPrioritiesResponse, WorkloadPriority } from '../../models/work-dispatcher.model';
import { WorkloadPrioritiesUtil } from '../../utils/workload-priorities.util';

export abstract class WorkloadPrioritiesApiService extends BaseApi {
  protected workloadPrioritiesApi: string;

  constructor(protected http: HttpClient, baseApi: string) {
    super(http);
    this.workloadPrioritiesApi = `${baseApi}/config/workloadPriorities`;
  }

  public getWorkloadPriorities(station?: string): Observable<WorkloadPriority[]> {
    return this.http
      .get<WorkloadPrioritiesResponse>(
        station
          ? `${this.workloadPrioritiesApi}/${station}`
          : this.workloadPrioritiesApi,
      )
      .pipe(
        map((res: WorkloadPrioritiesResponse) =>
          WorkloadPrioritiesUtil.setCompanyIdsForMany(res.workloads),
        ),
      );
  }

  public updateWorkloadPriorityCall(
    workloadPriorities: WorkloadPrioritiesResponse,
  ): Observable<void> {
    return this.http.put<void>(this.workloadPrioritiesApi, workloadPriorities);
  }
}
