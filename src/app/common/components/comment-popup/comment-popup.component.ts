import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'common-comment-popup',
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.scss'],
})
export class CommentPopupComponent implements OnInit {
  @Input()
  public comment: string;

  constructor() {}

  public ngOnInit() {}

  public onControlClick(event: Event): void {
    event.stopPropagation();
  }
}
