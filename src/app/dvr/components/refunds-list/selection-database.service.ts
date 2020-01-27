import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { RefundFlatNode } from '../../models/refund.model';

export class SelectionDatabaseService {
  private readonly selectionModel = new SelectionModel<RefundFlatNode>(true);

  private isAllowedEmitting = true;

  constructor(private treeControl: FlatTreeControl<RefundFlatNode>) {}

  public descendantsAllSelected(node: RefundFlatNode): boolean {
    const descendants = this.getDescendants(node);

    return descendants.every(child => this.selectionModel.isSelected(child));
  }

  public getSelectedDescendants(node: RefundFlatNode): RefundFlatNode[] {
    return this.getDescendants(node).filter(child => this.selectionModel.isSelected(child));
  }

  private getDescendants(node: RefundFlatNode): RefundFlatNode[] {
    return this.treeControl.getDescendants(node);
  }

  public descendantsPartiallySelected(node: RefundFlatNode): boolean {
    const descendants = this.getDescendants(node);
    const result = descendants.some(child => this.selectionModel.isSelected(child));

    return result && !this.descendantsAllSelected(node);
  }

  public get onChange(): Observable<RefundFlatNode[]> {
    return this.selectionModel.changed.pipe(
      filter(() => this.isAllowedEmitting),
      map((change: SelectionChange<RefundFlatNode>) => change.source.selected),
    );
  }

  public get selection(): SelectionModel<RefundFlatNode> {
    return this.selectionModel;
  }

  public setItems(items: RefundFlatNode[]): void {
    if (this.isDifferentList(items)) {
      this.isAllowedEmitting = false;

      this.selectionModel.clear();
      this.selectionModel.select(...items);

      this.isAllowedEmitting = true;
    }
  }

  private isDifferentList(items: RefundFlatNode[]): boolean {
    return (
      this.selectionModel.selected.length !== items.length ||
      this.selectionModel.selected.some(
        selected => !items.find(item => selected.refund.id === item.refund.id),
      )
    );
  }

  public toggleDescendant(node: RefundFlatNode): void {
    this.selectionModel.toggle(node);
    this.checkParents();
  }

  /**
   * Set select state to all parents according to their descendants
   */
  private checkParents(): void {
    this.getAllParents().forEach(node => {
      this.descendantsAllSelected(node)
        ? this.selectionModel.select(node)
        : this.selectionModel.deselect(node);
    });
  }

  private getAllParents(): RefundFlatNode[] {
    return this.treeControl.dataNodes.filter(node => node.expandable);
  }

  /**
   * Toggle the refund item selection. Select/deselect all the descendants node
   */
  public toggleParent(node: RefundFlatNode): void {
    const select = !this.selectionModel.isSelected(node);

    const descendants = this.getDescendants(node);

    select
      ? this.selectionModel.select(node, ...descendants)
      : this.selectionModel.deselect(node, ...descendants);
  }
}
