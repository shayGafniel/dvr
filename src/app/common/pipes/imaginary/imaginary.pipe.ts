import { Pipe, PipeTransform } from '@angular/core';

import { ImaginaryService } from '../../services/imaginary/imaginary.service';

@Pipe({ name: 'imaginary' })
export class ImaginaryPipe implements PipeTransform {
  constructor(private _imaginaryService: ImaginaryService) {}

  public transform(imaginaryId: any, isPageResource: boolean = false, page: any = 0): string {
    if (typeof imaginaryId === 'undefined') return;

    // Allow the use of local image, the string passed should start with / ./ or ../
    if (new RegExp('^.{0,2}/').test(imaginaryId)) {
      return imaginaryId;
    }

    if (isPageResource) {
      return this._imaginaryService.translateUrl(isPageResource, imaginaryId, page);
    }
    return this._imaginaryService.translateS3Url(imaginaryId);
  }
}
