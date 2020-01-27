import { Directive, ElementRef, Input } from '@angular/core';

/**
 * sets the height of the containing element to the entire window height minos the native element top,
 * in other words, it stretches the containing element all the way to the bottom of the containing window
 */
@Directive({
  selector: '[commonMaxFitHeight]',
})
export class MaxFitHeightDirective {
  protected _nativeElement: any;

  // Optional, just used for triggering a change event beyond the one set for the window 'load' event
  @Input()
  public set trigger(value: any) {
    this.applyHeight();
  }

  constructor(el: ElementRef) {
    // el.nativeElement.style.backgroundColor = 'yellow';
    this._nativeElement = el.nativeElement;

    // 'load' event will be fired when the whole page has done rendering
    window.addEventListener('load', (evt: Event) => this.applyHeight());
  }

  public applyHeight() {
    // Height is the entire window height minos the native element top
    const height = window.innerHeight - this._nativeElement.getBoundingClientRect().top;
    this._nativeElement.style.height = `${height}px`;
    this._nativeElement.style['overflow-y'] = 'auto';
  }
}
