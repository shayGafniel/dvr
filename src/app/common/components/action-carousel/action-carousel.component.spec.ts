import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NguCarouselModule } from '@ngu/carousel';

import { ActionCarouselComponent } from './action-carousel.component';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { MaterialModuleSpec } from '../../utils/material.module.spec';

const images = ['/app/common/images/invoice-2.png', '/app/common/images/invoice-another-tall-and-narrow.png'];

@Component({
  selector: 'common-image-viewer',
  template: '',
})
export class ImageViewerStubComponent implements Partial<ImageViewerComponent> {
  // noinspection JSUnusedGlobalSymbols
  public isDraggable = true;

  @Input()
  public draggableMinWidth;
  @Input()
  public image: string;

  // noinspection JSUnusedGlobalSymbols
  public reset(): void {}

  // noinspection JSUnusedGlobalSymbols
  public rotateLeft(): void {}

  // noinspection JSUnusedGlobalSymbols
  public rotateRight(): void {}

  // noinspection JSUnusedGlobalSymbols
  public zoomIn(): void {}

  // noinspection JSUnusedGlobalSymbols
  public zoomOut(): void {}
}

describe('ActionCarouselComponent', () => {
  let component: ActionCarouselComponent;
  let fixture: ComponentFixture<ActionCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModuleSpec, NguCarouselModule],
      declarations: [ActionCarouselComponent, ImageViewerStubComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCarouselComponent);
    component = fixture.componentInstance;

    component.images = images;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
