import { WorkloadsNames } from '../models/scape-lamb.model';

export class ScapeLambHelper {
  public static generateWorkloadsNames(ids: string[], names: string[]): WorkloadsNames {
    if (ids.length !== names.length) {
      const idsString = ids.join(', ');
      const namesString = names.join(', ');

      throw new Error(
        `Expected the same length of workloads ids '${idsString}' and names '${namesString}'`,
      );
    }

    return ids.reduce(
      (workloadsNames: WorkloadsNames, id, index) => ({ ...workloadsNames, [id]: names[index] }),
      {},
    );
  }
}
