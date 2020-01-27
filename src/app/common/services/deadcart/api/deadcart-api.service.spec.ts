import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import * as statusTexts from 'builtin-status-codes';

import { DeadcartApiService } from './deadcart-api.service';
import { mock_company_info } from './deadcart-api.mock-service';
import { DeadcartCompanyInfoResponse } from '../../../models/deadcart.model';
import { RequestMethod } from '../../../models/mock.model';

describe('DeadcartApiService', () => {
  const companyId = '1234567';
  const deadcartCompanyUrl = '/api/deadcart/v1.0/companyInfo';
  let deadcartApiService: DeadcartApiService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeadcartApiService],
    });
  }));

  beforeEach(() => {
    deadcartApiService = TestBed.get(DeadcartApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('get company info', () => {
    it("should send 'get' request with the correct URL", () => {
      deadcartApiService.getCompanyInfo(companyId).subscribe();
      const request = httpMock.expectOne(`${deadcartCompanyUrl}?companyId=${companyId}`);
      expect(request.request.method).toEqual(RequestMethod.Get);
    });

    it('should get a company info with the company id that was send', () => {
      deadcartApiService
        .getCompanyInfo(companyId)
        .subscribe((deadcartCompanyInfoResponse: DeadcartCompanyInfoResponse) => {
          expect(deadcartCompanyInfoResponse.httpStatus).toEqual(200);
          expect(deadcartCompanyInfoResponse.info.companyId).toEqual(companyId);
        });

      const request = httpMock.expectOne(`${deadcartCompanyUrl}?companyId=${companyId}`);

      const mockCompanyInfo = mock_company_info();
      mockCompanyInfo.companyId = companyId;
      request.flush(mockCompanyInfo);
    });

    it("should get 204 no content with data 'undefined'", () => {
      deadcartApiService
        .getCompanyInfo(companyId)
        .subscribe((deadcartCompanyInfoResponse: DeadcartCompanyInfoResponse) => {
          expect(deadcartCompanyInfoResponse.httpStatus).toEqual(204);
          expect(deadcartCompanyInfoResponse.info).toBeUndefined();
        });

      const request = httpMock.expectOne(`${deadcartCompanyUrl}?companyId=${companyId}`);
      request.flush('', { status: 204, statusText: statusTexts[204] });
    });
  });
});
