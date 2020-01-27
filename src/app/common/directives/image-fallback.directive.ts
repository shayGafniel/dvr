import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[commonImageFallback]',
})
export class ImageFallbackDirective {
  @Input()
  public default = '/app/common/images/no-image-available.svg';

  @Input()
  @HostBinding('src')
  public src: string;

  constructor() {}

  @HostListener('error')
  public onError() {
    this.src = this.default;
  }
}
