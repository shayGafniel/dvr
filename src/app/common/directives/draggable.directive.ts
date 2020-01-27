import { Directive, ElementRef, OnDestroy, OnInit, HostListener, Renderer2 } from '@angular/core';

/**
 * Taken from https://github.com/CoderAjay/ng2Draggable
 */

@Directive({
  selector: '[draggable]',
})
export class DraggableDirective implements OnDestroy, OnInit {
  private Δx = 0;
  private Δy = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'draggable', 'true');
  }

  @HostListener('dragstart', ['$event'])
  public onDragStart(event: MouseEvent) {
    this.Δx = event.x - this.el.nativeElement.offsetLeft;
    this.Δy = event.y - this.el.nativeElement.offsetTop;
  }

  @HostListener('drag', ['$event'])
  public onDrag(event: MouseEvent) {
    this.doTranslation(event.x, event.y);
  }

  @HostListener('dragend')
  public onDragEnd() {
    this.Δx = 0;
    this.Δy = 0;
  }

  private doTranslation(x: number, y: number) {
    if (!x || !y) return;

    this.renderer.setStyle(this.el.nativeElement, 'top', y - this.Δy + 'px');
    this.renderer.setStyle(this.el.nativeElement, 'left', x - this.Δx + 'px');
  }

  public ngOnDestroy(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'draggable', 'false');
  }
}
