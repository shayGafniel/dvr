import { Directive, Input, ElementRef, HostListener, OnInit } from '@angular/core';

/**
 * Taken from https://github.com/cedvdb/ng2draggable
 */

@Directive({
  selector: '[commonDraggable2]',
})
export class Draggable2Directive implements OnInit {
  private topStart: number;
  private leftStart: number;
  private _allowDrag: boolean = true;
  private md: boolean;
  private _handle: HTMLElement;

  constructor(public element: ElementRef) {}

  public ngOnInit() {
    // css changes
    if (this._allowDrag) {
      this.element.nativeElement.style.position = 'relative';
      this.element.nativeElement.className += ' cursor-draggable';
    }
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    if (event.button === 2 || (this._handle !== undefined && event.target !== this._handle)) return; // prevents right click drag, remove his if you don't want it
    this.md = true;
    this.topStart = event.clientY - this.element.nativeElement.style.top.replace('px', '');
    this.leftStart = event.clientX - this.element.nativeElement.style.left.replace('px', '');
  }

  @HostListener('document:mouseup')
  public onMouseUp() {
    this.md = false;
  }

  @HostListener('document:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent) {
    if (this.md && this._allowDrag) {
      this.element.nativeElement.style.top = event.clientY - this.topStart + 'px';
      this.element.nativeElement.style.left = event.clientX - this.leftStart + 'px';
    }
  }

  @HostListener('document:mouseleave')
  public onMouseLeave() {
    this.md = false;
  }

  @HostListener('touchstart', ['$event'])
  public onTouchStart(event: TouchEvent | any) {
    this.md = true;
    this.topStart =
      event.changedTouches[0].clientY - this.element.nativeElement.style.top.replace('px', '');
    this.leftStart =
      event.changedTouches[0].clientX - this.element.nativeElement.style.left.replace('px', '');
    event.stopPropagation();
  }

  @HostListener('document:touchend')
  public onTouchEnd() {
    this.md = false;
  }

  @HostListener('document:touchmove', ['$event'])
  public onTouchMove(event: TouchEvent | any) {
    if (this.md && this._allowDrag) {
      this.element.nativeElement.style.top = event.changedTouches[0].clientY - this.topStart + 'px';
      this.element.nativeElement.style.left =
        event.changedTouches[0].clientX - this.leftStart + 'px';
    }
    event.stopPropagation();
  }

  @Input('commonDraggable2')
  set allowDrag(value: boolean) {
    this._allowDrag = value;
    if (this._allowDrag) this.element.nativeElement.className += ' cursor-draggable';
    else
      this.element.nativeElement.className = this.element.nativeElement.className.replace(
        ' cursor-draggable',
        '',
      );
  }

  @Input()
  set ng2DraggableHandle(handle: HTMLElement) {
    this._handle = handle;
  }
}
