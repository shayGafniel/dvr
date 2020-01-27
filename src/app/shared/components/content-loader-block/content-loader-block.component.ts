import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-loader-block',
  templateUrl: './content-loader-block.component.html',
  styleUrls: ['./content-loader-block.component.scss'],
})
export class ContentLoaderBlockComponent implements OnInit {
  @Input()
  public heightBody = '100%';
  @Input()
  public heightTitle = '100%';
  @Input()
  public spaceBetween: string;
  @Input()
  public spaceTop: string;
  @Input()
  public widthBody = '100%';
  @Input()
  public widthTitle = '100%';

  constructor() {}

  public ngOnInit() {}
}
