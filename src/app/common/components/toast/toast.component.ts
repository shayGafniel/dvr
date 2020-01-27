import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'common-bo-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @Input()
  public buttonText: string;

  @Input()
  public buttonCallback: () => any; // Will be invoke when button is pressed by user - optional

  @Input()
  public displayWhen: boolean;

  @Input()
  public messageText: string;

  @Input()
  public enableToastReload = false;

  public userClickedClose: boolean;

  @Output()
  public buttonPressed: EventEmitter<any>;
  @Output()
  public close: EventEmitter<any>;

  constructor() {
    this.buttonPressed = new EventEmitter();
    this.close = new EventEmitter();
  }

  public ngOnInit(): any {
    this.userClickedClose = false;
  }

  public buttonClicked(): void {
    // for inner scope callback
    this.buttonCallback();

    // for parent scope callback
    this.buttonPressed.emit(undefined);
  }

  public closeClicked(): void {
    // close dialog
    this.userClickedClose = true;

    // Invoke close callback on parent scope
    this.close.emit(undefined);

    if (this.enableToastReload) {
      this.ngOnInit();
    }
  }
}
