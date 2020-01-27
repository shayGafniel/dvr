import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HEADER_CONTENT_TYPE_PLAIN } from '../../contracts/base-api';
import { MockResponse, MockService, RequestMethod } from '../../models/mock.model';
import { VendorResponseData } from './vendor-management.model';
import { VendorManagementAPIService } from './vendor-management-api.service';
import {
  mock_suppliers_data,
  mock_valid_vat_id_data,
  mock_valid_vendor_vat_id_data,
  mock_vendor_list,
  mock_vendor_response_data,
} from './vendor-management.mock';

@Injectable()
export class VendorManagementApiMockService implements MockService {
  public readonly serviceName = VendorManagementAPIService.VATBOX_SERVICE_NAME;

  public readonly mockResponses: MockResponse[] = [
    // vendor list
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendorList(req).body,
      method: RequestMethod.Get,
      status: (req: HttpRequest<any>) => this.getBodyAndStatusForVendorList(req).status,
      timeout: 500,
      urlTest: new RegExp('/vendors/from/[^/]*'),
    }),
    // get suppliers list
    new MockResponse({
      getBody: () => mock_suppliers_data(),
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/search/p1/[^/]*'),
    }),
    // bulk vendor
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForBulkVendor(req).body,
      method: RequestMethod.Post,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/bulk'),
    }),
    // vendor list
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForSearchVendorList(req).body,
      method: RequestMethod.Get,
      status: (req: HttpRequest<any>) => this.getBodyAndStatusForSearchVendorList(req).status,
      timeout: 500,
      urlTest: new RegExp('/search/[^/]*'),
    }),
    // create vendor
    new MockResponse({
      getBody: () => '5c1df33024000017fac58718',
      headers: new HttpHeaders(HEADER_CONTENT_TYPE_PLAIN),
      method: RequestMethod.Post,
      status: 201,
      timeout: 500,
      urlTest: /(\/vendor)/,
    }),
    // update vendor
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Put,
      status: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).status,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*'),
    }),
    // Validate Vendor VatId
    new MockResponse({
      getBody: (req: HttpRequest<any>) => mock_valid_vendor_vat_id_data(),
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/vatId/[^/]*/isValid/[^/]*'),
    }),
    // Validate VatId
    new MockResponse({
      getBody: (req: HttpRequest<any>) => mock_valid_vat_id_data(),
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vatId/[^/]*/isValid/[^/]*/split'),
    }),
    // get vendor
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Get,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*'),
    }),
    // create vendor contact
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Post,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/contact'),
    }),
    // Update Vendor Contact
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Put,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/contact/=.+'),
    }),
    // Delete Vendor Contact
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Delete,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/contact/[^/]*'),
    }),
    // Create Vendor Branch
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Post,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/branch'),
    }),
    // Update Vendor Branch
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Put,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/branch/[^/]*'),
    }),
    // Delete Vendor Branch
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Delete,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/branch/[^/]*'),
    }),
    // Create Vendor Branch Contact
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Post,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/branch/[^/]*/contact'),
    }),
    // Update Vendor Branch Contact
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Put,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/branch/[^/]*/contact/=.+'),
    }),
    // Delete Vendor Branch Contact
    new MockResponse({
      getBody: (req: HttpRequest<any>) => this.getBodyAndStatusForVendor(req).body,
      method: RequestMethod.Delete,
      status: 200,
      timeout: 500,
      urlTest: new RegExp('/vendor/[^/]*/branch/[^/]*/contact/[^/]*'),
    }),
  ];

  // noinspection JSMethodCanBeStatic
  private getBodyAndStatusForVendor(req: HttpRequest<any>): { body: any; status: number } {
    return {
      body: mock_vendor_response_data(3),
      status: 200,
    };
  }

  // noinspection JSMethodCanBeStatic
  private getBodyAndStatusForBulkVendor(req: HttpRequest<any>): { body: any } {
    const ids: number[] = req.body;
    const vendors: VendorResponseData[] = mock_vendor_list().filter(vendor => {
      return ids.includes(vendor.vendorId);
    });
    return {
      body: vendors,
    };
  }

  // noinspection JSMethodCanBeStatic
  private getBodyAndStatusForVendorList(req: HttpRequest<any>): { body: any; status: number } {
    const index: number = Number(req.url.substring(req.url.indexOf('from') + 5));
    const vendors: VendorResponseData[] = mock_vendor_list().slice(index, index + 20);
    return {
      body: vendors,
      status: 200,
    };
  }

  // noinspection JSMethodCanBeStatic
  private getBodyAndStatusForSearchVendorList(
    req: HttpRequest<any>,
  ): { body: any; status: number } {
    const term: string = req.params.get('term');
    const searchPoint: number = req.url.indexOf('search') + 7;
    const afterSearchPoint: string = req.url.slice(searchPoint);
    const index = Number(afterSearchPoint.substring(0, afterSearchPoint.indexOf('/')));
    const vendors: VendorResponseData[] = mock_vendor_list()
      .filter((vendorResponseData: VendorResponseData) => {
        return vendorResponseData.formalName.includes(term);
      })
      .slice(index, index + 20);
    return {
      body: vendors,
      status: 200,
    };
  }
}
