import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { RefundEntity } from '../../models/refund.model';

@Component({
  selector: 'app-refund-entities',
  templateUrl: './refund-entities.component.html',
  styleUrls: ['./refund-entities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundEntitiesComponent implements OnInit {
  @Input()
  public activeEntityId: string;
  @Input()
  public refundEntities: RefundEntity[];

  @Output()
  public entityIdSelect = new EventEmitter<string>();

  constructor() {}

  public ngOnInit() {}

  public isActive(refundEntity: RefundEntity): boolean {
    return refundEntity.id === this.activeEntityId;
  }

  public onRefundEntitySelect(refundEntity: RefundEntity): void {
    if (!this.isActive(refundEntity)) {
      this.entityIdSelect.emit(refundEntity.id);
    }
  }
}
