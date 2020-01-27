import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatTooltip } from '@angular/material';

@Directive({
  selector: '[isEllipsisActive]',
  providers: [MatTooltip],
})
export class IsEllipsisActiveDirective {

  public tooltip: MatTooltip;

  // variable to pass different value for title
  @Input('isEllipsisActive') public titleContent: string;

  constructor(tooltip: MatTooltip, private elementRef: ElementRef) {
    this.tooltip = tooltip;
  }

  @HostListener('mouseover')
  public mouseover() {
    // get the current element on mouseover over item
    const element = this.elementRef.nativeElement;
    // check when element(text) overflow in table
    if (element.offsetWidth < element.scrollWidth) {
      // get content text to be shown in title
      this.tooltip.message = this.titleContent ? this.titleContent : element.innerHTML;
      // show tooltip title
      this.tooltip.show();
    }
  }
}
