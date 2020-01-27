import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TableauTicket } from '~/shared/models/tableau.model';

@Injectable()
export class TableauApiService {
  public static VATBOX_SERVICE_NAME = 'support';
  public static API_BASE = `/api/${TableauApiService.VATBOX_SERVICE_NAME}/v1.0`;
  public static TABLEAU_PROXY_API = `${TableauApiService.API_BASE}/tableau`;

  constructor(private http: HttpClient) {}

  public getTableauTicket(): Observable<TableauTicket> {
    return this.http.get<TableauTicket>(TableauApiService.TABLEAU_PROXY_API);
  }
}
