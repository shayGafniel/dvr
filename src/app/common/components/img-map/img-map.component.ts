import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'common-img-map',
  templateUrl: './img-map.component.html',
  styleUrls: ['./img-map.component.scss'],
})
export class ImgMapComponent implements OnInit {
  /**
   * Canvas element.
   */
  @ViewChild('canvas', {static: false})
  private canvas: ElementRef;

  /**
   * Container element.
   */
  @ViewChild('container', {static: false})
  private container: ElementRef;

  /**
   * Image element.
   */
  @ViewChild('image', {static: false})
  private image: ElementRef;

  @Input('markers')
  set setMarkers(markers: number[][]) {
    this.markerActive = null;
    this.markerHover = null;
    this.markers = markers;
    this.originMarkers = [];
    this.markers.forEach(mark => {
      this.originMarkers.push([...mark]);
    });
    this.draw();
  }

  /**
   * Radius of the markers.
   */
  @Input()
  public markerRadius = 10;

  /**
   * Image source URL.
   */
  @Input()
  public set src(src: string) {
    const inputPath = this.generatePathNameFromSrc(src);
    const currentPath = this.generatePathNameFromSrc(this._src);
    if (inputPath !== currentPath) this._src = src;
  }

  /**
   * Image source URL.
   */
  public get src(): string {
    return this._src;
  }

  /**
   *
   * Is markers visible
   */
  @Input()
  public isHidden = false;

  /**
   * On change event.
   */
  @Output()
  public changeEvent = new EventEmitter<number[]>();

  /**
   * On mark event.
   */
  @Output()
  public markEvent = new EventEmitter<number[]>();

  /**
   * On load image.
   */
  @Output()
  public imageLoaded = new EventEmitter<void>();

  /**
   * image source
   */
  private _src: string;

  /**
   * Collection of markers.
   */
  private markers: number[][] = [];

  /**
   * Index of the hover state marker.
   */
  private markerHover: number = null;

  /**
   * Pixel position of markers.
   */
  private pixels: number[][] = [];

  /**
   * Index of the active state marker.
   */
  public markerActive: number;

  // Image size
  private width: number;
  private height: number;
  private widthZoomRatio = 1;
  private heightZoomRatio = 1;
  private originMarkers = [];

  constructor(private renderer: Renderer2) {}

  public ngOnInit() {}

  private change(): void {
    if (this.markerActive === null) {
      this.changeEvent.emit(null);
    } else {
      this.changeEvent.emit(this.markers[this.markerActive]);
    }
    this.draw();
  }

  /**
   * Get the cursor position relative to the canvas.
   */
  private cursor(event: MouseEvent): number[] {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  private generatePathNameFromSrc(src: string): string {
    return this.isUrl(src) ? new URL(src).pathname : src;
  }
  /**
   * isUrl
   * @param {string} imageSrc
   * @return {boolean}
   */
  private isUrl(imageSrc: string): boolean {
    try {
      return Boolean(new URL(imageSrc));
    } catch {
      return false;
    }
  }

  /**
   * Draw a marker.
   */
  private drawMarker(marker: number[], type?: string): void {
    const context = this.canvas.nativeElement.getContext('2d');
    context.beginPath();
    context.strokeStyle = 'rgb(61, 255, 35)';
    context.strokeRect(marker[0], marker[1], marker[2], 1);
    // context.moveTo(marker[2], marker[0]);
    // context.lineTo(marker[1], marker[0]);
    // switch (type) {
    //   case 'active':
    //     context.fillStyle = 'rgba(255, 0, 0, 0.6)';
    //     break;
    //   case 'hover':
    //     context.fillStyle = 'rgba(0, 0, 255, 0.6)';
    //     break;
    //   default:
    //     context.fillStyle = 'rgba(0, 0, 255, 0.4)';
    // }
    context.stroke();
  }

  /**
   * Check if a position is inside a marker.
   */
  private insideMarker(pixel: number[], coordinate: number[]): boolean {
    return (
      Math.sqrt(
        (coordinate[0] - pixel[0]) * (coordinate[0] - pixel[0]) +
          (coordinate[1] - pixel[1]) * (coordinate[1] - pixel[1]),
      ) < this.markerRadius
    );
  }

  /**
   * Convert a percentage position to a pixel position.
   */
  private markerToPixel(marker: number[]): number[] {
    const image: HTMLImageElement = this.image.nativeElement;
    return [(image.clientWidth / 100) * marker[0], (image.clientHeight / 100) * marker[1]];
  }

  /**
   * Convert a pixel position to a percentage position.
   */
  private pixelToMarker(pixel: number[]): number[] {
    const image: HTMLImageElement = this.image.nativeElement;
    return [(pixel[0] / image.clientWidth) * 100, (pixel[1] / image.clientHeight) * 100];
  }

  /**
   * Convert the markers relatively to zoom ratio
   */
  private markerToRelative(marker: number[], index): void {
    const image: HTMLImageElement = this.image.nativeElement;
    if (this.width && image.clientWidth) {
      marker[0] = this.returnSize([...this.originMarkers[index]][0], this.widthZoomRatio);
      marker[1] = this.returnSize([...this.originMarkers[index]][1], this.widthZoomRatio);
      marker[2] = this.returnSize([...this.originMarkers[index]][2], this.widthZoomRatio);
      marker[3] = this.returnSize([...this.originMarkers[index]][3], this.heightZoomRatio);
    }
  }

  private returnSize(origin, ratio) {
    return origin * ratio;
  }

  /**
   * Sets the new marker position.
   */
  private mark(pixel: number[]): void {
    this.markerActive = this.markers.length;
    this.markers.push(this.pixelToMarker(pixel));
    this.draw();
    this.markEvent.emit(this.markers[this.markerActive]);
  }

  /**
   * Sets the marker pixel positions.
   */
  private setPixels(): void {
    this.pixels = [];
    this.calcZoom();
    this.markers.forEach((marker, index) => {
      this.markerToRelative(marker, index);
    });
  }

  /**
   * Clears the canvas and draws the markers.
   */
  public draw(): void {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const container: HTMLDivElement = this.container.nativeElement;
    const image: HTMLImageElement = this.image.nativeElement;
    this.height = image.clientHeight;
    this.width = image.clientWidth;
    try {
      this.renderer.setAttribute(canvas, 'height', `${this.height}`);
      this.renderer.setAttribute(canvas, 'width', `${this.width}`);
    } catch (e) {
      console.error(`Component: ImgMapComponent function: draw() Error: ${e}`);
    }

    this.renderer.setStyle(container, 'height', `${this.height}px`);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, this.width, this.height);
    this.setPixels();
    this.markers.forEach((marker, index) => {
      this.drawMarker(marker);
      // if (this.markerActive === index) {
      //   this.drawMarker(pixel, 'active');
      // } else if (this.markerHover === index) {
      //   this.drawMarker(pixel, 'hover');
      // } else {
      //   this.drawMarker(pixel);
      // }
    });
  }

  public onClick(event: MouseEvent): void {
    const cursor = this.cursor(event);
    let active = false;
    if (this.changeEvent.observers.length) {
      let change = false;
      this.pixels.forEach((pixel, index) => {
        if (this.insideMarker(pixel, cursor)) {
          active = true;
          if (this.markerActive === null || this.markerActive !== index) {
            this.markerActive = index;
            change = true;
          }
        }
      });
      if (!active && this.markerActive !== null) {
        this.markerActive = null;
        change = true;
      }
      if (change) this.change();
    }
    if (!active && this.markEvent.observers.length) {
      this.mark(cursor);
    }
  }

  /**
   * onBeforeLoad
   */
  public onBeforeLoad(): void {
    console.log('Load Started');
  }

  /**
   * Executed on image load
   * @param {UIEvent} event
   */
  public onLoad(event: UIEvent): void {
    this.draw();
    this.imageLoaded.emit();
  }

  public onMousemove(event: MouseEvent): void {
    if (this.changeEvent.observers.length) {
      const cursor = this.cursor(event);
      let hover = false;
      let draw = false;
      this.pixels.forEach((pixel, index) => {
        if (this.insideMarker(pixel, cursor)) {
          hover = true;
          if (this.markerHover === null || this.markerHover !== index) {
            this.markerHover = index;
            draw = true;
          }
        }
      });
      if (!hover && this.markerHover !== null) {
        this.markerHover = null;
        draw = true;
      }
      if (draw) this.draw();
    }
  }

  public onMouseout(event: MouseEvent): void {
    if (this.markerHover) {
      this.markerHover = null;
      this.draw();
    }
  }

  public calcZoom() {
    this.widthZoomRatio =
      Math.round(
        (this.image.nativeElement.clientWidth / this.image.nativeElement.naturalWidth) * 100,
      ) / 100;
    this.heightZoomRatio =
      Math.round(
        (this.image.nativeElement.clientHeight / this.image.nativeElement.naturalHeight) * 100,
      ) / 100;
  }

  public onResize(event): void {
    this.calcZoom();
    this.draw();
  }
}
