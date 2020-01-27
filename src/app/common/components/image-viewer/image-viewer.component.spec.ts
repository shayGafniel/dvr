import { ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformerDirective } from '../../directives/transformer/transformer.directive';
import { ImageViewerComponent } from './image-viewer.component';
import { SharedCommonModule } from '../../shared-common.module';
import { WindowRefStubService } from '../../utils/window.util.spec';
import { WindowRefService } from '../../services/window.service';
import { HttpClientModule } from '@angular/common/http';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, SharedCommonModule],
      providers: [{ provide: WindowRefService, useClass: WindowRefStubService }],
    }).overrideComponent(ImageViewerComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    component.image = '/app/common/images/invoice-2.png';
    fixture.detectChanges();
  });

  function setWindowWidth(size: number): void {
    const windowRef = TestBed.get(WindowRefService);

    windowRef.nativeWindow.innerWidth = size;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable draggable on small screen', () => {
    setWindowWidth(component.draggableMinWidth - 1);
    expect(component.isDraggable).toBe(false, 'small screen should not be draggable');

    setWindowWidth(component.draggableMinWidth + 1);
    expect(component.isDraggable).toBe(true, 'big screen should be draggable');
  });

  it('should provide view children', () => {
    expect(component.draggable instanceof ElementRef).toBe(true, 'draggable is not a ElementRef');

    expect(component.transformer instanceof TransformerDirective).toBe(
      true,
      'transformer is not a TransformerDirective',
    );
  });
});
