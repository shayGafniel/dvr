import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[commonTruncate]',
})
export class TruncateDirective {
  @HostBinding('class.truncated')
  public isover = true;
  @HostBinding('class.nontruncated')
  public isout = false;

  constructor() {}

  @HostListener('mouseover')
  public onMouseOver() {
    this.isover = false;
    this.isout = true;
  }

  @HostListener('mouseout')
  public onMouseOut() {
    this.isover = true;
    this.isout = false;
  }
}
