import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[commonDisableMousewheel]',
})
export class DisableMouseWheelDirective {
  @HostListener('mousewheel', ['$event'])
  public onMouseWheel(e: Event) {
    e.preventDefault();
  }
}
