import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[background-color]'
})

export class BackgroundColorDirective {
  @Input()
  public set setColor(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

  constructor(
    private el: ElementRef
  ) {}
}
