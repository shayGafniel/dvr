import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss'],
})
export class BackComponent implements OnInit {
  constructor() {}

  public ngOnInit() {}

  public onClick(): void {
    window.history.back();
  }
}
