import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { WindowRefService } from '../../services/window.service';
import { TransformerDirective } from '../../directives/transformer/transformer.directive';

@Component({
  selector: 'common-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewerComponent implements OnInit {
  private readonly checkDraggable = new BehaviorSubject(undefined);

  public isDraggable = true;

  @Input()
  public draggableMinWidth = 960;
  @Input()
  public image: string;

  @ViewChild('draggable', {static: false})
  public draggable: ElementRef;
  @ViewChild(TransformerDirective, {static: false})
  public transformer: TransformerDirective;

  constructor(private windowRef: WindowRefService, private http: HttpClient) {}

  public ngOnInit() {
    this.setCheckDraggable();
    this.onWindowResize();
  }

  private setCheckDraggable(): void {
    this.checkDraggable.subscribe(() => {
      this.isDraggable = this.windowRef.nativeWindow.innerWidth > this.draggableMinWidth;
    });
  }

  @HostListener('window:resize')
  public onWindowResize() {
    this.checkDraggable.next(undefined);
  }

  public reset(): void {
    this.transformer.reset();
    this.draggable.nativeElement.style = '';
  }

  public rotateLeft(): void {
    this.transformer.rotateLeft();
  }

  public rotateRight(): void {
    this.transformer.rotateRight();
  }

  public zoomIn(): void {
    this.transformer.zoomIn();
  }

  public zoomOut(): void {
    this.transformer.zoomOut();
  }

  public download() {
    this.http.get(this.image, { responseType: 'blob' }).subscribe(val => {
      const url = URL.createObjectURL(val);
      this.forceDownload(url, this.generateFileName());
      URL.revokeObjectURL(url);
    });
  }

  public forceDownload(blob, filename) {
    const aTag = document.createElement('a');
    aTag.download = filename;
    aTag.href = blob;
    aTag.target = '_blank';
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }

  private generateFileName() {
    return this.image
      .split('\\')
      .pop()
      .split('/')
      .pop();
  }
}
