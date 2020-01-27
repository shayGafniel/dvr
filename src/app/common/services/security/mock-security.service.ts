import { Injectable } from '@angular/core';

import { CookiesService } from '../cookies/cookies.service';
import { USER_DETAILS_COOKIE_NAME } from '../security/security.model';

export interface SecurityConfiguration {
  vatboxUserId: string;
  vatboxUserEmail: string;
}

@Injectable()
export class MockSecurityService {
  public static readonly securityConfiguration: SecurityConfiguration = {
    vatboxUserId: '123',
    vatboxUserEmail: 'erez@vatbox.com',
  };

  constructor(private cookies: CookiesService) {}

  public setMockSecurityCookies(): void {
    this.cookies.setCookie(
      USER_DETAILS_COOKIE_NAME,
      btoa(
        JSON.stringify({
          id: MockSecurityService.securityConfiguration.vatboxUserId,
          email: MockSecurityService.securityConfiguration.vatboxUserEmail,
        }),
      ),
      999,
    );
  }
}
