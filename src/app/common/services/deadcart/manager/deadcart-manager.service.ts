import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DeadcartApiService } from '../api/deadcart-api.service';
import { BulkCompaniesInfo, DeadcartCompanyInfoResponse } from '../../../models/deadcart.model';

@Injectable()
export class DeadcartManagerService {
  constructor(private deadcartApiService: DeadcartApiService) {}

  public getCompanyInfo(companyId: string): Observable<DeadcartCompanyInfoResponse> {
    return this.deadcartApiService.getCompanyInfo(companyId);
  }

  public getBulkCompanyInfo(companiesIds: string[]): Observable<BulkCompaniesInfo> {
    return this.deadcartApiService.getBulkCompaniesInfo(companiesIds);
  }
}
