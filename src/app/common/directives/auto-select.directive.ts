/* auto-select is an attribute directive which suitable for 'input' and 'text-area' tagged elements.
 It makes the element text automatically selected on rendering time */

import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[commonAutoSelect]' })
export class AutoSelectDirective {
  constructor(el: ElementRef) {
    setTimeout(() => {
      el.nativeElement.select();
    }, 1000);
  }
}
