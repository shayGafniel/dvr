import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'common-svg-image',
  template: '<div [innerHTML]="(svgTemplate | async)"></div>',
})
export class SVGImageComponent implements OnChanges {
  @Input()
  public src: string;
  @Input()
  public fill: string;
  @Input()
  public width: string;
  @Input()
  public height: string;
  public svgTemplate: Observable<SafeHtml>;

  constructor(private _http: HttpClient, private _sanitizer: DomSanitizer) {}

  public ngOnChanges(changes: {}) {
    this.svgTemplate = this._http.get(this.src, { responseType: 'text' }).pipe(
      map(response => {
        // at the moment, assume these svg properties exists
        return this._sanitizer.bypassSecurityTrustHtml(
          response
            .replace(/fill="[^\"]+"/, `fill="${this.fill}"`)
            .replace(/width="[^\"]+"/, `width="${this.width}"`)
            .replace(/height="[^\"]+"/, `height="${this.height}"`),
        );
      }),
    );
  }
}
