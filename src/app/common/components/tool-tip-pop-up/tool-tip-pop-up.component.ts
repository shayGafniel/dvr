import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'common-bo-tool-tip-pop-up',
  templateUrl: './tool-tip-pop-up.component.html',
  styleUrls: ['./tool-tip-pop-up.component.scss'],
})
export class ToolTipPopUpComponent implements OnInit, OnDestroy {
  @Input()
  public question: string;
  @Input()
  public hintsList: Array<string>;
  @Input()
  public stylesUpdateTrigger: Observable<any>;
  @Input()
  public isRelative: boolean = false;

  private _stylesUpdateTriggerSubscription: Subscription;

  public isShowButtonOn = true;

  /*** call apply offsets each time messages value changes ***/

  public ngOnInit(): void {
    const self = this;
    this._stylesUpdateTriggerSubscription = this.stylesUpdateTrigger.subscribe(() => {
      setTimeout(self.applyOffsets, 0);
    });
  }

  /*** un-subscribe ***/
  public ngOnDestroy(): void {
    if (typeof this._stylesUpdateTriggerSubscription !== 'undefined')
      this._stylesUpdateTriggerSubscription.unsubscribe();
  }

  /*** open and close the messages box ***/

  public openCloseClicked(): void {
    this.isShowButtonOn = !this.isShowButtonOn;
    if (this.isShowButtonOn) {
      setTimeout(this.applyOffsets, 0);
    }
  }

  /***
   * Motivation - This component often shows several time on the screen.
   *
   * Each show of this component might has different text length and therefor different height.
   *
   * The design requirements - https://projects.invisionapp.com/share/JADCPOD2D#/screens
   * order that each box has triangle shaped tip on its left border, and an orange warning icon on its left.
   *
   * Both tip and icon should be position on the center of box height, so this function does by adding top offsets dynamically.
   *
   * ***/

  private applyOffsets() {
    // move the left triangle and warn icon to the middle of frame
    const frameElements: HTMLCollectionOf<Element> = document.getElementsByClassName(
      'tool-tip-frame',
    );
    const triangleElements: HTMLCollectionOf<Element> = document.getElementsByClassName(
      'frame-triangle',
    );
    const warnIconElements: HTMLCollectionOf<Element> = document.getElementsByClassName(
      'warn-icon',
    );

    Array.from(frameElements).forEach((frameElement: Element, idx: number) => {
      if (triangleElements[idx] && warnIconElements[idx]) {
        const triangleOffset: number = (frameElement.clientHeight - 14) / 2;
        const warnIconOffset: number =
          (frameElement.clientHeight - warnIconElements[idx].clientHeight) / 2;
        triangleElements[idx].setAttribute('style', `top: ${triangleOffset}px;`);
        warnIconElements[idx].setAttribute('style', `top: ${warnIconOffset}px;`);
      }
    });
  }

  /*** shows this box if there are messages ***/

  public get isShown(): boolean {
    return this.hintsList && this.hintsList.length > 0;
  }
}
