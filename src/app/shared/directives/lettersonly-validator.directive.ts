import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CommonUtil } from '../../shared/utils/common.util';

@Directive({
  selector: '[lettersOnly]',
})

export class RestrictLettersOnlyDirective {

  constructor(
    private el: ElementRef,
  ) {
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(e: KeyboardEvent) {
    if (
      // Allow: Delete, Backspace, Tab, Escape, Enter
      ["Tab", "Delete", "Backspace", "Escape", "Enter"].indexOf(e.key) !== -1 ||
      (e.key === "A" && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === "C" && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === "V" && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === "X" && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === "A" && e.metaKey === true) || // Cmd+A (Mac)
      (e.key === "C" && e.metaKey === true) || // Cmd+C (Mac)
      (e.key === "V" && e.metaKey === true) || // Cmd+V (Mac)
      (e.key === "X" && e.metaKey === true) // Cmd+X (Mac)
    ) {
      return;
    }
    if (!(e.key.match(CommonUtil.regexForOnlyLetters))) {
      e.preventDefault();
    }
  }
}
