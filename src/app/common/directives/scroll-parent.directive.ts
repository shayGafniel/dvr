import { Directive, Input, ElementRef, OnChanges, SimpleChange } from '@angular/core';

@Directive({
  selector: '[commonScrollParent]',
})
export class ScrollParentDirective implements OnChanges {
  private _nativeElement: any;

  @Input()
  public commonScrollParent: boolean;

  constructor(el: ElementRef) {
    this._nativeElement = el.nativeElement;
  }

  public ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (this.commonScrollParent && !!this._nativeElement.parentElement) {
      const oldParentScrollTop: number = this._nativeElement.parentElement.scrollTop;
      const newParentScrollTop: number =
        this._nativeElement.offsetTop - this._nativeElement.parentElement.offsetTop;
      const scrollDistance = newParentScrollTop - oldParentScrollTop;

      const interval = 20; // ms
      const duration = 200; // ms
      const stepOffset = scrollDistance / (duration / interval);
      let aggregatedOffset = 0;
      if (stepOffset !== 0) {
        const intervalCancelable = setInterval(() => {
          try {
            if (!this._nativeElement.parentElement) return;

            aggregatedOffset += stepOffset;
            this._nativeElement.parentElement.scrollTop =
              this._nativeElement.parentElement.scrollTop + stepOffset;
            if (Math.abs(aggregatedOffset) - Math.abs(scrollDistance) >= 0) {
              this._nativeElement.parentElement.scrollTop = newParentScrollTop;
              clearInterval(intervalCancelable);
            }
          } catch (err) {
            clearInterval(intervalCancelable);
            throw err;
          }
        }, interval);
      }
    }
  }
}
