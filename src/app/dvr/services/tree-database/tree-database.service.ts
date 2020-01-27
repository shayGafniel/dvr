import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable, of } from 'rxjs';

import { PotentialHelper } from '../../helpers/potential.helper';
import { RefundFlatNode, RefundNode } from '../../models/refund.model';

export class TreeDatabaseService {
  public dataSource: MatTreeFlatDataSource<RefundNode, RefundFlatNode>;
  public treeControl: FlatTreeControl<RefundFlatNode>;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  private flatNodeMap = new Map<RefundFlatNode, RefundNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  private nestedNodeMap = new Map<RefundNode, RefundFlatNode>();

  /** Keep the last parent */
  private lastParent = null;

  constructor() {
    this.treeControl = new FlatTreeControl<RefundFlatNode>(this.getLevel, this.isExpandable);
    const treeFlattener: MatTreeFlattener<RefundNode, RefundFlatNode> = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener);
  }

  /**
   * Transformer to convert nested node to flat node. Record the new nodes in maps for later use.
   */
  private transformer = (node: RefundNode, level: number): RefundFlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    let currentParent: string = null;

    if (existingNode && existingNode.refund.id === node.refund.id) {
      return existingNode;
    }

    if (!level) {
      // Parent
      this.lastParent = node.item;
    } else {
      currentParent = this.lastParent;
    }

    const flatNode: RefundFlatNode = PotentialHelper.refundNodeToFlatNode(node, level, currentParent);

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  };

  private getLevel = (node: RefundFlatNode): number => node.level;

  private isExpandable = (node: RefundFlatNode): boolean => node.expandable;

  private getChildren = (node: RefundNode): Observable<RefundNode[]> => of(node.children);

  public initialize(itemNodes: RefundNode[]): void {
    this.dataSource.data = itemNodes;
  }
}
