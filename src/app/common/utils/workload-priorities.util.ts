import { WorkEntity, WorkloadCompanyId, WorkloadPriority } from '../models/work-dispatcher.model';
import { safeMap } from './utils';

export class WorkloadPrioritiesUtil {
  public static getCompaniesIds(workloads: WorkloadPriority[]) {
    return workloads.reduce((companiesIds: string[], workload) => {
      const workloadCompaniesIds: WorkloadCompanyId[] = WorkloadPrioritiesUtil.removeDuplicates(
        workload.companyIds,
        'companyId',
      );

      const newCompaniesItems = workloadCompaniesIds
        .filter((companyItem: WorkloadCompanyId) => !companiesIds.includes(companyItem.companyId))
        .reduce((accumulator: string[], companyItem: WorkloadCompanyId) => {
          accumulator.push(companyItem.companyId);

          return accumulator;
        }, []);

      companiesIds.push(...newCompaniesItems);

      return companiesIds;
    }, []);
  }

  public static getEntitiesIds(entities: WorkEntity[]): string[] {
    return entities.map(entity => entity.companyId);
  }

  public static getWorkloadsIds(workloads: WorkloadPriority[]): string[] {
    return workloads.map(workload => workload.workloadId);
  }

  public static removeDuplicates<T>(array: T[], property: keyof T): T[] {
    return array.filter((element, index) => {
      return array.map(mapObj => mapObj[property]).indexOf(element[property]) === index;
    });
  }

  public static setCompanyIdsForMany(workloadPriorities: WorkloadPriority[]): WorkloadPriority[] {
    return (workloadPriorities || []).map(workloadPriority =>
      WorkloadPrioritiesUtil.setCompanyIds(workloadPriority),
    );
  }

  public static setCompanyIds(workloadPriority: WorkloadPriority): WorkloadPriority {
    const clone: WorkloadPriority = { ...workloadPriority };

    if (WorkloadPrioritiesUtil.isExpediteCompanyIdOfChaotic(clone.companyIds[0])) {
      clone.companyIds = safeMap(clone.companyIds, companyId => ({
        ...companyId,
        evidencesLeft: companyId.invoicesLeft,
      }));
    }

    return clone;
  }

  private static isExpediteCompanyIdOfChaotic(companyId: WorkloadCompanyId): boolean {
    return companyId && typeof companyId.invoicesLeft === 'number';
  }
}
