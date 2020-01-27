import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ImaginaryInfoResponse, ImaginaryService } from './imaginary.service';

@Injectable()
export class ImageRotationManager {
  private _imageRotation = 0;

  constructor(private _imaginaryAPIService: ImaginaryService) {}

  public set imageRotation(val: number) {
    this._imageRotation = val;
  }

  public fixRotationOnThisImage(imageId: string): Observable<ImaginaryInfoResponse> {
    return this._imaginaryAPIService.fixImageRotation(imageId, this._imageRotation);
  }
}
