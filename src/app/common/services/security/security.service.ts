import { Injectable } from '@angular/core';

import { CookiesService } from '../cookies/cookies.service';
import { LOGIN_COOKIE_NAME, LOGIN_URL, USER_DETAILS_COOKIE_NAME, UserDetails } from './security.model';
import { SecurityApiService } from './security-api.service';

@Injectable()
export class SecurityService {
  public static TOKEN_STORAGE_KEY_NAME = 'x-vatbox-token';

  constructor(private securityApiService: SecurityApiService, private cookies: CookiesService) {}

  // delete the login and user token
  public cleanAndLogout(browserWindow: Partial<Window> = window): void {
    // TODO omrim Delete this code when we move to token instead of cookie
    this.cookies.deleteCookie(LOGIN_COOKIE_NAME);
    this.cookies.deleteCookie(USER_DETAILS_COOKIE_NAME);
    localStorage.removeItem(SecurityService.TOKEN_STORAGE_KEY_NAME); // TODO omrim move to security service
    browserWindow.location.assign(LOGIN_URL); // redirect to login app
  }

  // delete the login related domain cookie and redirect to /login
  public logout(browserWindow: Partial<Window> = window): void {
    this.securityApiService.logoutFromServer().subscribe(() => {
        this.cleanAndLogout(browserWindow);
      },
      err => {
        console.error('logout failed:', err);
        this.cleanAndLogout(browserWindow);
      });
  }

  public userDetails(): UserDetails {
    const cookie = this.cookies.getCookie(USER_DETAILS_COOKIE_NAME);
    if (cookie) {
      return JSON.parse(atob(cookie)); // decode the user data of ng.user.data cookie
    }
    return;
  }
}
