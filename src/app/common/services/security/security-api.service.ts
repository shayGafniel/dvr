import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SecurityApiService {
  public static VATBOX_SERVICE_NAME = 'login';
  public static LOGOUT_URL = `/api/${SecurityApiService.VATBOX_SERVICE_NAME}/v2.0/logout`;

  constructor(
    private http: HttpClient,
  ) {}

  public logoutFromServer(): Observable<any>  {
    return this.http.put(SecurityApiService.LOGOUT_URL, {});
  }
}
