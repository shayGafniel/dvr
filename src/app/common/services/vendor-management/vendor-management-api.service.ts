import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { BaseApi, ServerErrorResponse, ServerResponse } from '../../contracts/base-api';
import { ConfigurationAPIService } from '../configuration/configuration-api.service';
import { Country } from '../configuration/configuration.model';
import {
  Branch,
  Contact,
  FilterInputForm,
  Supplier,
  ValidateVatIdResponse,
  Vendor,
  VendorResponseData,
} from './vendor-management.model';

export interface SearchResponse extends ServerResponse {
  suppliers: Supplier[];
}
export interface SupplierResponse extends ServerResponse {
  supplier: Supplier;
}

@Injectable()
export class VendorManagementAPIService extends BaseApi {
  public static VATBOX_SERVICE_NAME = 'greenpages';
  public static API_BASE = `/api/${VendorManagementAPIService.VATBOX_SERVICE_NAME}/v1.0`;
  public static VENDOR_API = `${VendorManagementAPIService.API_BASE}/vendor`;
  public static VENDOR_LIST_API = `${VendorManagementAPIService.API_BASE}/vendors/from`;
  public static VENDOR_BULK_API = `${VendorManagementAPIService.VENDOR_API}/bulk`;
  public static VENDOR_SEARCH_API = `${VendorManagementAPIService.VENDOR_API}/search`;
  public static VENDOR_P1_SEARCH_API = `${VendorManagementAPIService.VENDOR_API}/search/p1/0`;
  public static SEARCH_PARAMS_COUNTRY = 'country';
  public static SEARCH_PARAMS_TERM = 'term';

  constructor(http: HttpClient, private _confService: ConfigurationAPIService) {
    super(http);
  }

  // get VATBox countries list
  public getCountries(): Observable<Country[]> {
    return this._confService.getConfSortedAlphabetically().pipe(
      mergeMap(confResponse => {
        return of(confResponse.countries);
      }),
    );
  }

  public searchSuppliers(term: string, country: string, limit: number): Observable<SearchResponse> {
    const params = `?${VendorManagementAPIService.SEARCH_PARAMS_TERM}=${term}&${
      VendorManagementAPIService.SEARCH_PARAMS_COUNTRY
    }=${country}`;
    return this.responseToServerResponse<SearchResponse, ServerErrorResponse>(
      this.http.get(`${VendorManagementAPIService.VENDOR_P1_SEARCH_API}${encodeURI(params)}`, {
        observe: 'response',
      }),
      (res, vendors: Vendor[]) => {
        const suppliers: Supplier[] = this.createSupplierList(vendors);
        return { suppliers: suppliers };
      },
    );
  }

  public getSupplierById(supplierId: number, addressId?: number): Observable<SupplierResponse> {
    return this.responseToServerResponse<SupplierResponse, ServerErrorResponse>(
      this.http.get(`${VendorManagementAPIService.VENDOR_API}/${supplierId}`, {
        observe: 'response',
      }),
      (res, vendorResponseData: VendorResponseData) => {
        let vendor: Vendor = vendorResponseData;
        if (!!addressId) {
          const foundBranch: Branch = vendorResponseData.branches.find(
            (branch: Branch) => branch.branchId === addressId,
          );
          if (!!foundBranch) {
            vendor = {
              ...vendor,
              formalName: foundBranch.branchFormalName,
              vendorAddress: {
                ...vendor.vendorAddress,
                streetNumber: foundBranch.branchAddress.streetNumber,
                street: foundBranch.branchAddress.street,
                city: foundBranch.branchAddress.city,
              },
            };
          }
        }
        const suppliers: Supplier[] = !!vendor ? this.createSupplierList([vendor]) : [];
        return { supplier: suppliers[0] };
      },
    );
  }

  /**
   * getVendorList
   * get Vendor list - VendorResponseData[]
   * @returns {Observable<VendorResponseData[]>}
   */
  public getVendorList(filter: FilterInputForm): Observable<VendorResponseData[]> {
    const queryParams: HttpParams = new HttpParams().append('term', filter.term);
    if (!!filter.term) {
      return this.http.get<VendorResponseData[]>(
        `${VendorManagementAPIService.VENDOR_SEARCH_API}/${filter.offset}`,
        {
          params: queryParams,
        },
      );
    } else {
      return this.http.get<VendorResponseData[]>(
        `${VendorManagementAPIService.VENDOR_LIST_API}/${filter.offset}`,
      );
    }
  }

  /**
   * get Bulk Vendor by ids
   */
  public getBulkVendorByIds(ids: number[]): Observable<VendorResponseData[]> {
    return this.http.post<VendorResponseData[]>(
      `${VendorManagementAPIService.VENDOR_BULK_API}`,
      ids,
    );
  }

  /**
   * getVendorData
   * Get Vendor Data By Vendor Id
   * @returns {Observable<VendorResponseData>}
   */
  public getVendorData(vendorId: number): Observable<VendorResponseData> {
    return this.http.get<VendorResponseData>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}`,
    );
  }

  /**
   * addVendor
   * Add Vendor
   * @returns {Observable<any>}
   */
  public createVendor(vendor: Vendor): Observable<any> {
    return this.http.post(`${VendorManagementAPIService.VENDOR_API}`, vendor, {
      responseType: 'text',
    });
  }

  /**
   * updateVendor
   * Update Vendor By Vendor Id
   * @returns {Observable<VendorResponseData>}
   */
  public updateVendor(vendorId: number, vendor: Vendor): Observable<VendorResponseData> {
    return this.http.put<VendorResponseData>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}`,
      vendor,
    );
  }

  /**
   * createVendorContact
   * Create Vendor Contact
   * @returns {Observable<VendorResponseData>}
   */
  public createVendorContact(vendorId: number, contact: Contact): Observable<VendorResponseData> {
    return this.http.post<VendorResponseData>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}/contact`,
      contact,
    );
  }

  /**
   * updateVendorContact
   * Update Vendor Contact
   * @returns {Observable<VendorResponseData>}
   */
  public updateVendorContact(
    vendorId: number,
    contactId: string,
    contact: Contact,
  ): Observable<VendorResponseData> {
    return this.http.put<VendorResponseData>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}/contact/${contactId}`,
      contact,
    );
  }

  /**
   * deleteVendorContact
   * Delete Vendor Contact
   * @returns {Observable<any>}
   */
  public deleteVendorContact(vendorId: number, contactId: string): Observable<any> {
    return this.http.delete<any>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}/contact/${contactId}`,
    );
  }

  /**
   * createVendorBranch
   * Create Vendor Branch
   * @returns {Observable<VendorResponseData>}
   */
  public createVendorBranch(vendorId: number, branch: Branch): Observable<VendorResponseData> {
    return this.http.post<VendorResponseData>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}/branch`,
      branch,
    );
  }

  /**
   * updateVendorBranch
   * Update Vendor Branch
   * @returns {Observable<VendorResponseData>}
   */
  public updateVendorBranch(
    vendorId: number,
    branchId: number,
    branch: Branch,
  ): Observable<VendorResponseData> {
    return this.http.put<VendorResponseData>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}/branch/${branchId}`,
      branch,
    );
  }

  /**
   * deleteVendorBranch
   * Delete Vendor Branch
   * @returns {Observable<any>}
   */
  public deleteVendorBranch(vendorId: number, branchId: number): Observable<any> {
    return this.http.delete<any>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}/branch/${branchId}`,
    );
  }

  /**
   * createVendorBranchContact
   * Create Vendor Branch Contact
   * @returns {Observable<VendorResponseData>}
   */
  public createVendorBranchContact(
    vendorId: number,
    branchId: number,
    contact: Contact,
  ): Observable<VendorResponseData> {
    return this.http.post<VendorResponseData>(
      `${VendorManagementAPIService.VENDOR_API}/${vendorId}/branch/${branchId}/contact`,
      contact,
    );
  }

  /**
   * updateVendorBranchContact
   * Update Vendor Branch Contact
   * @returns {Observable<VendorResponseData>}
   */
  public updateVendorBranchContact(
    vendorId: number,
    branchId: number,
    contactId: string,
    contact: Contact,
  ): Observable<VendorResponseData> {
    return this.http.put<VendorResponseData>(
      `${
        VendorManagementAPIService.VENDOR_API
      }/${vendorId}/branch/${branchId}/contact/${contactId}`,
      contact,
    );
  }

  /**
   * deleteVendorBranchContact
   * Delete Vendor Branch Contact
   * @returns {Observable<any>}
   */
  public deleteVendorBranchContact(
    vendorId: number,
    branchId: number,
    contactId: string,
  ): Observable<any> {
    return this.http.delete<any>(
      `${
        VendorManagementAPIService.VENDOR_API
      }/${vendorId}/branch/${branchId}/contact/${contactId}`,
    );
  }

  /**
   * validateVatID
   * Validate Vendor Vat ID
   * @returns {Observable<ValidateVatIdResponse>}
   */
  public validateVatID(
    vendorId: number,
    vatId: string,
    country: string,
  ): Observable<ValidateVatIdResponse> {
    if (vendorId) {
      return this.http.get<ValidateVatIdResponse>(
        `${VendorManagementAPIService.VENDOR_API}/${vendorId}/vatId/${vatId}/isValid/${country}`,
      );
    } else {
      return this.http.get<ValidateVatIdResponse>(
        `${VendorManagementAPIService.API_BASE}/vatId/${vatId}/isValid/${country}/split`,
      );
    }
  }

  private createSupplierList(vendors: Vendor[]): Supplier[] {
    return vendors.map((vendor: Vendor) => {
      return {
        supplierId: vendor.vendorId,
        name: vendor.formalName,
        address:
          vendor.vendorAddress.streetNumber +
          ' ' +
          vendor.vendorAddress.street +
          ', ' +
          vendor.vendorAddress.city,
        vatId: vendor.vatId,
        taxId: vendor.taxId,
        country: vendor.country,
        addressId: vendor.branchId,
      };
    });
  }
}
