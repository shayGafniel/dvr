import { getCurrencySymbol } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { isString } from 'lodash-es';

import { ActionCarouselComponent } from '../../../common/components/action-carousel/action-carousel.component';
import { MultiSelectOption } from '../../../common/models/multy-select.model';
import { ImaginaryPipe } from '../../../common/pipes/imaginary/imaginary.pipe';
import { MultiSelectUtil } from '../../../common/utils/multy-select.util';
import { ImaginaryItem, Refund } from '../../models/dvr.model';
import { GroupedRefundNodes, RefundFlatNode } from '../../models/refund.model';
import { TreeDatabaseService } from '../../services/tree-database/tree-database.service';
import * as fromCommentForm from '../../store/comment-form/comment-form.reducer';

interface GroupedTrees {
  [country: string]: TreeDatabaseService;
}

@Component({
  selector: 'app-refunds-approve-list',
  templateUrl: './refunds-approve-list.component.html',
  styleUrls: ['./refunds-approve-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundsApproveListComponent implements OnChanges, OnInit {
  @Input()
  public accountId?: number;
  @Input()
  public commentFormState?: fromCommentForm.State;
  @Input()
  public countryOptions: MultiSelectOption[];
  @Input()
  public currencyCode: string = 'EUR';
  @Input()
  public entityId?: string;
  @Input()
  public groupedRefundNodes: GroupedRefundNodes;

  public groupedTrees: GroupedTrees = {};

  constructor(private dialog: MatDialog, private imaginaryPipe: ImaginaryPipe) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['groupedRefundNodes']) {
      this.initializeTreeDatabases();
    }
  }

  private initializeTreeDatabases(): void {
    this.groupedTrees = Object.entries(this.groupedRefundNodes).reduce(
      (groupedTrees, [country, nodes]) => {
        groupedTrees[country] = new TreeDatabaseService();
        groupedTrees[country].initialize(nodes);

        return groupedTrees;
      },
      {} as GroupedTrees,
    );
  }

  public ngOnInit() {}

  public asFlatNode(node: any): RefundFlatNode {
    return node;
  }

  public get currencySymbol(): string {
    return getCurrencySymbol(this.currencyCode, 'narrow');
  }

  public getCountryNameByCode(code: string): string {
    return MultiSelectUtil.getDisplayByValue(this.countryOptions, code) || code;
  }

  public getChildrenCommentsCountByNode(node: RefundFlatNode): string {
    const commentsCount = node.refund.children.reduce(
      (count, child) => count + (child.comment ? 1 : 0),
      0,
    );

    return commentsCount > 0 ? commentsCount.toString() : null;
  }

  public getChildrenCommentsCountByStore(children: Refund[]): number {
    return children.reduce((count, child) => {
      const comment = this.commentFormState.value.comments.accounts[this.accountId].entities[
        this.entityId
      ].refunds[child.id];

      if (isString(comment) && comment.length) {
        return count + 1;
      }

      return count;
    }, 0);
  }

  public getDescendantsAmount(node: RefundFlatNode, country: string): number {
    const descendants = this.groupedTrees[country].treeControl.getDescendants(node);

    return descendants.reduce((amount, descendant) => amount + descendant.refund.details.amount, 0);
  }

  public hasChild = (_: number, node: RefundFlatNode): boolean => node.expandable;

  public onImagesOpen(images: ImaginaryItem[], title: string): void {
    const dialogRef: MatDialogRef<ActionCarouselComponent> = this.dialog.open(
      ActionCarouselComponent,
      {
        height: '80vh',
        panelClass: 'dialog-image-viewer',
        width: '80vw',
      },
    );
    dialogRef.componentInstance.images = this.getImaginaryIdsImages(images);
    dialogRef.componentInstance.title = title;
  }

  private getImaginaryIdsImages(images: ImaginaryItem[]): string[] {
    return images.map((imaginaryItem: ImaginaryItem) =>
      this.imaginaryPipe.transform(
        imaginaryItem.imaginaryId,
        imaginaryItem.isPdfOrTiff,
        imaginaryItem.currentPage,
      ),
    );
  }
}
