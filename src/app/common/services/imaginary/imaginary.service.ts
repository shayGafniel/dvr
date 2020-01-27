import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BaseApi,
  HEADER_CONTENT_TYPE_MULTIPART_FORM_DATA,
  ServerErrorResponse,
  ServerResponse,
} from '../../contracts/base-api';
import { ImaginaryInfo } from './imaginary.model';

export interface ImaginaryInfoResponse extends ServerResponse {
  info: ImaginaryInfo;
}

@Injectable()
export class ImaginaryService extends BaseApi {
  public static VATBOX_SERVICE_NAME = 'imaginary';
  public static BASE_API = `/api/${ImaginaryService.VATBOX_SERVICE_NAME}/v1.0`;
  public static ASSET_API = `${ImaginaryService.BASE_API}/asset`;

  constructor(http: HttpClient) {
    super(http);
  }

  public static imageApi(id: string, asset: boolean = false) {
    return asset ? `${ImaginaryService.ASSET_API}/${id}` : `${ImaginaryService.BASE_API}/${id}`;
  }

  public static infoApi(id: string) {
    return `${ImaginaryService.imageApi(id)}/info`;
  }

  public static imageByPageNumberApi(id: string, page: number, asset: boolean = false) {
    return `${ImaginaryService.imageApi(id, asset)}/page/${page}`;
  }

  // used by crop
  public translateUrl(isPageResource: boolean, id: string, page?: number): string {
    return isPageResource && typeof page !== 'undefined'
      ? ImaginaryService.imageByPageNumberApi(id, page)
      : ImaginaryService.imageApi(id);
  }

  // used by imaginary pipe
  public translateS3Url(id: string, isPageResource: boolean = false): any {
    return ImaginaryService.imageApi(id, true);
  }

  public imaginaryImageInfo(imaginaryID: string): Observable<ImaginaryInfoResponse> {
    return this.responseToServerResponse<ImaginaryInfoResponse, ServerErrorResponse>(
      this.http.get(ImaginaryService.infoApi(imaginaryID), { observe: 'response' }),
      (res, resJson) => {
        return {
          info: {
            id: resJson.id,
            mimeType: resJson.mimeType,
            originalFileName: resJson.originalFileName,
            // This is a hack: assume default metaData values for simple images (cases where imaginary doesn't send it)
            numPdfPages:
              resJson.metaData && typeof resJson.metaData.numberOfPages !== 'undefined'
                ? resJson.metaData.numberOfPages
                : 1,
            pageHeightPx:
              resJson.metaData && typeof resJson.metaData.pageHeight !== 'undefined'
                ? resJson.metaData.pageHeight
                : 15000,
            pageWidthPx:
              resJson.metaData && typeof resJson.metaData.pageWidth !== 'undefined'
                ? resJson.metaData.pageWidth
                : 0,
          },
        };
      },
    );
  }

  public fixImageRotation(
    imaginaryID: string,
    rotation: number,
  ): Observable<ImaginaryInfoResponse> {
    return this.responseToServerResponse<ImaginaryInfoResponse, ServerErrorResponse>(
      this.http.post(
        `${ImaginaryService.ASSET_API}/${imaginaryID}`,
        JSON.stringify([{ action: 'rotate', parameters: rotation }]),
        { observe: 'response' },
      ),
    );
  }

  public uploadFile(invoice: File): Observable<ImaginaryInfo> {
    const formData: FormData = new FormData();
    formData.append('file', invoice);
    return this.http.post<ImaginaryInfo>(`${ImaginaryService.ASSET_API}`, formData, {
      headers: HEADER_CONTENT_TYPE_MULTIPART_FORM_DATA,
    });
  }

  public pdfDigest(imaginaryID: string): Observable<any> {
    return this.http.post(`${ImaginaryService.BASE_API}/${imaginaryID}/digest`, {} );
  }

  /*** in case no image on cloudinary ask it from s3 and recover cloudinary with this id ***/
  public isImageOnS3(imaginaryID: string): Observable<ServerResponse> {
    return this.responseToServerResponse<ServerResponse, ServerErrorResponse>(
      this.http.get(`${ImaginaryService.ASSET_API}/${imaginaryID}`, { observe: 'response' }),
      res => {
        return {
          isImageOnS3: res.status === 404,
        };
      },
    );
  }
}
