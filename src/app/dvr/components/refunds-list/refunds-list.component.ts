import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { getCurrencySymbol } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { debounceTime, map, mapTo, takeUntil } from 'rxjs/operators';

import { ActionCarouselComponent } from '../../../common/components/action-carousel/action-carousel.component';
import { ImaginaryPipe } from '../../..//common/pipes/imaginary/imaginary.pipe';
import { ImaginaryItem, Refund } from '../../models/dvr.model';
import { RefundFlatNode, RefundNode } from '../../models/refund.model';
import { SelectionDatabaseService } from './selection-database.service';
import { TreeDatabaseService } from '../../services/tree-database/tree-database.service';
import * as fromCommentForm from '../../store/comment-form/comment-form.reducer';
import { GateApiService } from '../../../common/services/gate/gate-api.service';
import { TaxTailorImaginaryIdsParams } from '../../../common/services/gate/models/rails-data.model';
import { ImaginaryInfoResponse, ImaginaryService } from '../../../common/services/imaginary/imaginary.service';

@Component({
  selector: 'app-refunds-list',
  templateUrl: './refunds-list.component.html',
  styleUrls: ['./refunds-list.component.scss'],
})
export class RefundsListComponent implements OnChanges, OnDestroy, OnInit {
  @Input() public accountId: number;
  @Input() public commentFormState: fromCommentForm.State;
  @Input() public countryCode: string;
  @Input() public currencyCode: string = 'EUR';
  @Input() public entityId: string;
  @Input() public refundNodes: RefundNode[] = [];
  @Input() public selectedFlatNodes: RefundFlatNode[] = [];

  @Output() public selectedFlatNodesChanges = new EventEmitter<RefundFlatNode[]>();

  public get selection(): SelectionModel<RefundFlatNode> {
    return this.selectionDatabase.selection;
  }

  public get dataSource(): MatTreeFlatDataSource<RefundNode, RefundFlatNode> {
    return this.treeDatabase.dataSource;
  }

  public get treeControl(): FlatTreeControl<RefundFlatNode> {
    return this.treeDatabase.treeControl;
  }

  private componentDestroyed$ = new Subject();
  private selectionDatabase: SelectionDatabaseService;

  constructor(
    private dialog: MatDialog,
    private imaginaryPipe: ImaginaryPipe,
    private treeDatabase: TreeDatabaseService,
    private gateApiService: GateApiService,
    private imaginaryService: ImaginaryService,
  ) {
    this.selectionDatabase = new SelectionDatabaseService(this.treeControl);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['refundNodes']) {
      this.initializeTreeDatabase();
      this.setItems();
    }

    if (changes['selectedFlatNodes']) {
      this.setItems();
    }
  }

  private initializeTreeDatabase(): void {
    this.treeDatabase.initialize(this.refundNodes);
  }

  private setItems(): void {
    this.selectionDatabase.setItems(this.selectedFlatNodes);
  }

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  public ngOnInit() {
    this.watchForSelection();
  }

  private watchForSelection(): void {
    this.selectionDatabase.onChange
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(150),
      )
      .subscribe((items: RefundFlatNode[]) => this.selectedFlatNodesChanges.emit(items));
  }

  public asFlatNode(node: any): RefundFlatNode {
    return node;
  }

  public get currencySymbol(): string {
    return getCurrencySymbol(this.currencyCode, 'narrow');
  }

  public descendantsPartiallySelected(node: RefundFlatNode): boolean {
    return this.selectionDatabase.descendantsPartiallySelected(node);
  }

  public getDescendantsAmount(node: RefundFlatNode): number {
    const descendants = this.treeControl.getDescendants(node);

    return descendants.reduce((amount, descendant) => amount + descendant.refund.details.amount, 0);
  }

  public getSelectedAndCommentedDescendantsCount(node: RefundFlatNode): number {
    return this.getSelectedAndCommentedDescendants(node).length;
  }

  private getSelectedAndCommentedDescendants(node: RefundFlatNode): RefundFlatNode[] {
    return this.selectionDatabase.getSelectedDescendants(node).filter(child => {
      return this.getRefundComment(child.refund).length > 0;
    });
  }

  private getRefundComment(refund: Refund): string {
    return this.commentFormState.value.comments.accounts[this.accountId].entities[this.entityId]
      .refunds[refund.id];
  }

  public hasChild = (_: number, node: RefundFlatNode): boolean => node.expandable;

  public onImagesOpen(node: RefundFlatNode): void {
    const images = node.refund.details.images;
    if (!images) {
      this.fetchImaginaryIds(node).subscribe((imaginaryIds: string[]) => {
        if (Array.isArray(imaginaryIds) && imaginaryIds.length === 0) {
          node['isPending'] = false;
          node.refund.details.images = [];
        }
        const infos$ = imaginaryIds.map(id => this.imaginaryService.imaginaryImageInfo(id));
        forkJoin(infos$)
          .pipe(
            map(infos => {
              return this.generateImaginaryItemsFromImaginaryInfos(infos);
            }),
          )
          .subscribe((digestedImaginaryItems$: Observable<ImaginaryItem>[]) => {
            forkJoin(digestedImaginaryItems$)
              .pipe(
                map((imaginaryItems: ImaginaryItem[]) => {
                  return imaginaryItems.filter(res => res !== null);
                }),
              )
              .subscribe((imaginaryItems: ImaginaryItem[]) => {
                node.refund.details.images = imaginaryItems;
                node['isPending'] = false;
                if (!this.isNoImages(node)) this.openImagesDialog(imaginaryItems, node.item);
              });
          });
      });
    } else {
      this.openImagesDialog(images, node.item);
    }
  }

  private generateImaginaryItemsFromImaginaryInfos(
    infos: ImaginaryInfoResponse[],
  ): Observable<ImaginaryItem>[] {
    return infos.map(currInfoResponse => {
      const currInfo = currInfoResponse.httpBodyObject;
      const imaginaryItem: ImaginaryItem = {
        isPdfOrTiff: false,
        imaginaryId: currInfo.id,
        currentPage: 0,
      };

      if (this.isPdfOrTiff(currInfo)) {
        imaginaryItem.isPdfOrTiff = true;
        imaginaryItem.currentPage = 0;
        if (currInfo['metaData']['numberOfPages'] === 1) {
          return this.imaginaryService.pdfDigest(currInfo['id']).pipe(mapTo(imaginaryItem));
        } else {
          // Implementing Here! If needed to support multiple images in pdf
          return of(null);
        }
      } else {
        return of(imaginaryItem);
      }
    });
  }

  public openImagesDialog(listOfImaginaryIds: ImaginaryItem[], title: string) {
    const dialogRef: MatDialogRef<ActionCarouselComponent> = this.dialog.open(
      ActionCarouselComponent,
      {
        height: '80vh',
        panelClass: 'dialog-image-viewer',
        width: '80vw',
      },
    );
    dialogRef.componentInstance.images = this.getImaginaryImages(listOfImaginaryIds);
    dialogRef.componentInstance.title = title;
  }

  public toggleDescendant(node: RefundFlatNode): void {
    this.selectionDatabase.toggleDescendant(node);
  }

  public toggleParent(node: RefundFlatNode): void {
    return this.selectionDatabase.toggleParent(node);
  }

  public isNoImages(node: RefundFlatNode) {
    const images = node.refund.details.images;
    return (
      this.isSpecialReasonWithoutImages(node.item, node.parent) ||
      (Array.isArray(images) && images.length === 0)
    );
  }

  public isPendingForImaginaryIds(node: RefundFlatNode) {
    return !!node['isPending'];
  }

  private isSpecialReasonWithoutImages(title: string, parentTitle: string): boolean {
    return (
      (!!title && title.toLowerCase() === 'invoice not found') ||
      title.toLowerCase() === 'unmatched justification' ||
      (!!parentTitle && parentTitle.toLowerCase() === 'invalid address on invoice')
    );
  }

  private fetchImaginaryIds(node: RefundFlatNode): Observable<string[]> {
    node['isPending'] = true;
    const imaginaryIdsParams: TaxTailorImaginaryIdsParams = {
      entity_id: this.entityId,
      reason: !!node.parent ? node.parent : node.item,
      country_code: this.countryCode,
    };
    if (!!node.parent) imaginaryIdsParams.sub_reason = node.item;
    return this.gateApiService.getImaginaryIdsByReason(imaginaryIdsParams);
  }

  private getImaginaryImages(images: ImaginaryItem[]): string[] {
    return images.map((imaginaryItem: ImaginaryItem) =>
      this.imaginaryPipe.transform(
        imaginaryItem.imaginaryId,
        imaginaryItem.isPdfOrTiff,
        imaginaryItem.currentPage,
      ),
    );
  }

  private isPdfOrTiff(info) {
    return info['mimeType'] === 'application/pdf' || info['mimeType'] === 'image/tiff';
  }
}
