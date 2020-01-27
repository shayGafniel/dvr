import { Component, OnInit } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'common-action-carousel',
  templateUrl: './action-carousel.component.html',
  styleUrls: ['./action-carousel.component.scss'],
})
export class ActionCarouselComponent implements OnInit {
  public images: string[];
  public title: string;

  public carouselBanner: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 400,
    point: {
      visible: false,
    },
    load: 2,
    loop: true,
    touch: false,
  };

  constructor() {}

  public ngOnInit() {}
}
