import { Component, Input } from '@angular/core';

@Component({
  selector: 'common-fetching-invoice',
  templateUrl: './fetching-invoice.component.html',
  styleUrls: ['./fetching-invoice.component.scss'],
})
export class FetchingInvoiceComponent {
  @Input()
  public isPending = true;
}
