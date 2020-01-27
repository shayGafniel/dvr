import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { mock_company_info } from '../api/deadcart-api.mock-service';
import { DeadcartApiService } from '../api/deadcart-api.service';
import { DeadcartManagerService } from './deadcart-manager.service';
import { DeadcartCompanyInfoResponse } from '../../../models/deadcart.model';

describe('DeadcartManagerService', () => {
  let deadcartApiService: DeadcartApiService;
  let deadcartManagerService: DeadcartManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeadcartApiService, DeadcartManagerService],
    });
  }));

  beforeEach(() => {
    deadcartApiService = TestBed.get(DeadcartApiService);
    deadcartManagerService = TestBed.get(DeadcartManagerService);
  });

  describe('get company info', () => {
    const companyId = '1234567';
    const mockCompanyInfo = mock_company_info();

    it('should return a company info', () => {
      spyOn(deadcartApiService, 'getCompanyInfo').and.callFake((requestCompanyId: string) => {
        mockCompanyInfo.companyId = requestCompanyId;

        return of({ info: mockCompanyInfo });
      });

      deadcartManagerService
        .getCompanyInfo(companyId)
        .subscribe((deadcartCompanyInfoResponse: DeadcartCompanyInfoResponse) => {
          expect(deadcartCompanyInfoResponse.info.companyId).toEqual(companyId);
          expect(deadcartCompanyInfoResponse.info).toEqual(mockCompanyInfo);
        });
    });

    it('should call api company info with companyId', () => {
      spyOn(deadcartApiService, 'getCompanyInfo');
      deadcartManagerService.getCompanyInfo(companyId);
      expect(deadcartApiService.getCompanyInfo).toHaveBeenCalledWith(companyId);
    });
  });
});
