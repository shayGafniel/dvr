import { FlatTreeControl } from '@angular/cdk/tree';

import { RefundFlatNode } from '../../models/refund.model';
import { SelectionDatabaseService } from './selection-database.service';

class TreeDB {
  public treeControl: FlatTreeControl<RefundFlatNode>;

  constructor() {
    this.treeControl = new FlatTreeControl<RefundFlatNode>(this.getLevel, this.isExpandable);
  }

  private getLevel = (node: RefundFlatNode): number => node.level;

  private isExpandable = (node: RefundFlatNode): boolean => node.expandable;
}

describe('SelectionDatabaseService', () => {
  let service: SelectionDatabaseService;
  let treeDb: TreeDB;

  beforeEach(() => {
    treeDb = new TreeDB();
    service = new SelectionDatabaseService(treeDb.treeControl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
