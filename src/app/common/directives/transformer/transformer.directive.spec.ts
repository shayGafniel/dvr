import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TransformerDirective } from './transformer.directive';

@Component({
  selector: 'app-host',
  template: `<div commonTransformer class="transformed"></div>`,
})
export class HostComponent {
  @ViewChild(TransformerDirective)
  public transformer: TransformerDirective;
}

describe('TransformerDirective', () => {
  let directive: TransformerDirective;
  let element: HTMLDivElement;
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, TransformerDirective],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    directive = host.transformer;
    element = fixture.debugElement.query(By.css('.transformed')).nativeElement;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should rotate the element to the left', () => {
    directive.rotateLeft();

    expect(element.style.transform).toContain(
      `rotate(${directive.initRotate - directive.rotateStep}deg)`,
    );
  });

  it('should rotate the element to the right', () => {
    directive.rotateRight();

    expect(element.style.transform).toContain(
      `rotate(${directive.initRotate + directive.rotateStep}deg)`,
    );
  });

  it('should zoom in the element', () => {
    directive.zoomIn();

    expect(element.style.transform).toContain(
      `scale(${directive.initScale + directive.scaleStep})`,
    );
  });

  it('should zoom out the element', () => {
    directive.zoomOut();

    let scale = directive.initScale - directive.scaleStep;
    scale = scale < 1 ? 1 : scale;

    expect(element.style.transform).toContain(`scale(${scale})`);

    directive.zoomIn();
    directive.zoomOut();

    expect(element.style.transform).toContain(`scale(${directive.initScale})`);
  });

  it('should reset transformations', () => {
    directive.rotateLeft();
    directive.zoomIn();
    directive.reset();

    expect(element.style.transform).toContain(
      `rotate(${directive.initRotate}deg)`,
      'not init value',
    );
    expect(element.style.transform).toContain(`scale(${directive.initScale})`, 'not init value');
  });
});
