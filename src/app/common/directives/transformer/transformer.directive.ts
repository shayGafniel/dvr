import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[commonTransformer]',
})
export class TransformerDirective {
  public readonly initRotate = 0;
  public readonly initScale = 1;
  public readonly rotateStep = 90;
  public readonly scaleStep = 0.5;

  private rotate = this.initRotate;
  private scale = this.initScale;

  constructor(private el: ElementRef) {}

  private apply(): void {
    this.normalizeRotate();
    this.normalizeScale();
    this.el.nativeElement.style.transform = `rotate(${this.rotate}deg) scale(${this.scale})`;
  }

  private normalizeRotate(): void {
    if (this.rotate >= 360 || this.rotate <= -360) {
      this.rotate = 0;
    }
  }

  private normalizeScale(): void {
    this.scale = this.scale < 1 ? 1 : this.scale;
  }

  public reset(): void {
    this.rotate = this.initRotate;
    this.scale = this.initScale;
    this.apply();
  }

  public rotateLeft(): void {
    this.rotate -= this.rotateStep;
    this.apply();
  }

  public rotateRight(): void {
    this.rotate += this.rotateStep;
    this.apply();
  }

  public zoomIn(): void {
    this.scale += this.scaleStep;
    this.apply();
  }

  public zoomOut(): void {
    this.scale -= this.scaleStep;
    this.apply();
  }
}
