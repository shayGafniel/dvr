import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ImageRotationManager } from '../../services/imaginary/image-orientation.manager';

// required in order to prevent compilation error
interface ElementWithOffset extends Element {
  offsetTop?: number;
  offsetLeft?: number;
}

@Component({
  selector: 'bo-responsive-rotatable-image',
  templateUrl: './responsive-rotatable-image.component.html',
  styleUrls: ['./responsive-rotatable-image.component.scss'],
})
export class ResponsiveRotatableImageComponent implements OnInit, OnChanges {
  @Input()
  public src: string;

  @Input()
  public size: number; // Optional

  @Input()
  public backgroundColor: string; // Optional

  @Input()
  public isMarkersHidden: boolean = false;

  @Input()
  public isOcr: boolean = false;

  // Optional - if true don't show the place holder
  //   (for cases like expedite where the component has it's own place holder).
  @Input()
  public noPlaceHolder: boolean;

  @Output()
  public valuesChangeEvent: EventEmitter<string[]> = new EventEmitter();

  @Output()
  public imageLoaded: EventEmitter<any> = new EventEmitter();

  private _img: HTMLImageElement;

  private _rotation: number;

  private _zoom: number;
  public markers = [];

  public constructor(private _imageRotationManager: ImageRotationManager) {
    this._rotation = 0; // degrees
    this._zoom = 1; // ratio
  }

  public ngOnInit(): void {
    const self = this;
    const imageParentElement: ElementWithOffset = document.getElementsByClassName(
      'image-parent',
    )[0];
    const parentOffsetLeft: number = imageParentElement.offsetLeft;
    imageParentElement.setAttribute(
      'style',
      `width: ${window.innerWidth - parentOffsetLeft}px;${
        !!this.backgroundColor ? 'background: ' + this.backgroundColor + ';' : ''
      }`,
    );
    // set image size in case to input request if specified
    // or to width of root element if no input or if input size larger than root element width.
    self.size =
      typeof self.size !== 'undefined' &&
      self.size < window.document.getElementsByClassName('responsive-image-root')[0].clientWidth
        ? self.size
        : window.document.getElementsByClassName('responsive-image-root')[0].clientWidth;

    // style image onload
    self._img = new Image();
    self._img.onload = () => {
      self.applyStyle();
    };
    self._img.src = self.src;
    self.noPlaceHolder = typeof self.noPlaceHolder !== 'undefined' ? self.noPlaceHolder : false;
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvents(event: KeyboardEvent) {
    const magicKeys: Array<string> = ['Equal', 'Minus', 'Comma', 'Period', 'KeyC', 'KeyD'];
    if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
      this.setYAxisScroll('scroll');
    } else if (event.ctrlKey && magicKeys.indexOf(event.code) !== -1) {
      event.preventDefault();
      event.stopPropagation();
      switch (event.code) {
        case 'Equal':
          this.zoomIn();
          break;
        case 'Minus':
          this.zoomOut();
          break;
        case 'Comma':
          this.rotateLeft();
          break;
        case 'Period':
          this.rotateRight();
          break;
      }

      if (event.shiftKey) {
        switch (event.code) {
          case 'KeyC':
            this.restoreZoomTo100Percent();
            break;
          case 'KeyD':
            this.toggleMarkers();
            break;
        }
      }
    }
  }

  public isDisableRestoreZoom() {
    const imageElement: Element = document.getElementsByClassName('image')[0];
    return (
      this._zoom === 1 &&
      (imageElement['style'].top.trim() === '' ||
        imageElement['style'].top.trim() === '0px' ||
        (imageElement['style'].left.trim() === '' || imageElement['style'].left.trim() === '0px'))
    );
  }

  public rotateLeft() {
    this._rotation -= 90;
    this.applyStyle();
  }

  public rotateRight() {
    this._rotation += 90;
    this.applyStyle();
  }

  public zoomIn() {
    this._zoom = this._zoom > 7 ? this._zoom : this._zoom * 1.2;
    this.applyStyle();
  }

  public zoomOut() {
    this._zoom = this._zoom < 0.3 ? this._zoom : this._zoom / 1.2;
    this.applyStyle();
  }

  public restoreZoomTo100Percent() {
    const imageElement: Element = document.getElementsByClassName('image')[0];
    imageElement['style'].top = 0;
    imageElement['style'].left = 0;

    this._zoom = 1;
    this.applyStyle();
  }

  public mouseWheelZoom(event: WheelEvent) {
    event.preventDefault();
    this.setYAxisScroll('hidden');
    if (event.deltaY > 0) {
      this.zoomOut();
    } else if (event.deltaY < 0) {
      this.zoomIn();
    }
  }

  public toggleMarkers() {
    this.isMarkersHidden = !this.isMarkersHidden;
  }

  private setYAxisScroll(value: string) {
    const imageParentElement: Element = document.getElementsByClassName('image-parent')[0];
    imageParentElement['style'].overflowY = value;
  }

  private applyStyle() {
    const imageElement: Element = document
      .getElementsByClassName('image-parent')[0]
      .getElementsByClassName('image')[0];
    if (!!imageElement && !!imageElement.setAttribute) {
      imageElement.setAttribute(
        'style',
        `transform: rotate(${this._rotation}deg) scale(${this._zoom});
            top: ${imageElement['style'] ? imageElement['style'].top : 0};
            left: ${imageElement['style'] ? imageElement['style'].left : 0};
            max-width: ${this.size}px; max-height:${this.size}px;
            background-size: contain; background-repeat: no-repeat;`,
      );
    }
    this._imageRotationManager.imageRotation = this._rotation;
  }

  public ngOnChanges(changes) {
    if (changes.src) {
      this.resetZoomRotation();
      this.applyStyle();
    }
  }

  private resetZoomRotation(): void {
    this._rotation = 0;
    this._zoom = 1;
  }

  public onImageLoaded() {
    this.imageLoaded.emit();
  }
}
