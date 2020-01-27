import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[commonTableCardInput]',
})
export class TableCardInputDirective implements AfterViewInit {
  @Input()
  public isInputValid = false;
  @Input()
  public valueInput: string;
  @Output()
  public valueOutput: EventEmitter<string> = new EventEmitter();
  @Output()
  public cardClosed: EventEmitter<string> = new EventEmitter();
  private matCard;
  private label;
  private inputElement;

  constructor(private el: ElementRef, private renderer2: Renderer2) {}

  public ngAfterViewInit() {
    this.label = this.el.nativeElement.getElementsByTagName('label').item(0);
    this.matCard = this.el.nativeElement.getElementsByTagName('mat-card').item(0);
    // Initialize input element selectors which is created only in: "ngAfterViewInit"
    this.inputElement = this.el.nativeElement.getElementsByTagName('input').item(0);
    this.setStyleForMatCard();
    if (this.isInputValueNotEmptyAndValid()) {
      this.hideCard(); // If the value is empty keep the 'edit mode' in order to be able to edit it
    }
    this.bindOnInputEvents();
  }

  // Show the element on click
  @HostListener('click')
  public onClick() {
    this.showCard();
  }

  /**
   * setStyleForMatCard
   */
  private setStyleForMatCard() {
    this.renderer2.setStyle(this.matCard, 'padding', '0 10px 0 10px');
    this.renderer2.setStyle(this.matCard, 'position', 'absolute');
    this.renderer2.setStyle(this.matCard, 'top', '0');
    this.renderer2.setStyle(this.matCard, 'left', '0');
  }

  /**
   * bindOnInputEvents
   */
  private bindOnInputEvents() {
    // on blur
    this.renderer2.listen(this.inputElement, 'blur', () => {
      if (this.isInputValueNotEmptyAndValid()) {
        // If the value is empty keep the 'edit mode' in order to be able to edit it
        this.hideCard();
      }
    });

    // on input change
    this.renderer2.listen(this.inputElement, 'input', (input: any /*InputEvent*/) => {
      this.valueInput = input.currentTarget.value;
      this.valueOutput.emit(this.valueInput);
    });
  }

  // Show Hide Card Methods
  private showCard() {
    this.renderer2.setStyle(this.matCard, 'display', 'block');
    this.renderer2.setProperty(this.inputElement, 'value', this.valueInput); // Set the current value for the input
    this.inputElement.focus();
  }

  private hideCard() {
    this.renderer2.setStyle(this.matCard, 'display', 'none');
    this.renderer2.setProperty(this.label, 'innerHTML', this.valueInput); // Set the current value for the label
    this.cardClosed.emit(this.valueInput);
  }
  // **End Of Show Hide Card Methods
  /**
   * isInputValueNotEmptyAndValid
   * @return {boolean}
   */
  private isInputValueNotEmptyAndValid(): boolean {
    return !!this.valueInput && this.valueInput.trim() !== '' && this.isInputValid;
  }
}
