import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyPositiveNumber]',
})
export class OnlyPositiveNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  public onInputChange(event) {
    const previousValue = this.el.nativeElement.value;
    this.el.nativeElement.value = previousValue.replace(/[^0-9]*/g, '');
    if (previousValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
