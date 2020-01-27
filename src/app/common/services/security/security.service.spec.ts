import { async, TestBed } from '@angular/core/testing';

import { CookiesService } from '../cookies/cookies.service';
import { USER_DETAILS_COOKIE_NAME } from './security.model';
import { SecurityService } from './security.service';
import { SecurityApiService } from './security-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export const mockWindow: any = {
  // now, $window.location.path will update that empty object
  location: {
    assign: (): void => {
      // do nothing
    },
  },
  // we keep the reference to window.document
  document: window.document,
};

describe('SecurityService', () => {
  let cookieService: CookiesService;
  let securityService: SecurityService;
  let securityApiService: SecurityApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CookiesService, SecurityService, SecurityApiService],
    });
  }));

  beforeEach(() => {
    cookieService = TestBed.get(CookiesService);
    securityService = TestBed.get(SecurityService);
    securityApiService = TestBed.get(SecurityApiService);
  });

  describe('logout', () => {
    it('should call logout from server in the api', () => {
      securityService.logout(mockWindow);

      securityApiService.logoutFromServer().subscribe(() => {
        expect(true).toBe(true);
      }, (err) => {
        expect(false).toBe(true, `logout was failed ${err}`);
      });

    });
  });

  describe('getter userDetails', () => {
    it('userDetails from cookie', () => {
      const userDetails = { id: '123', email: 'erez@vatbox.com' };

      // set the user details cookie
      cookieService.setCookie(USER_DETAILS_COOKIE_NAME, btoa(JSON.stringify(userDetails)), 1);

      // expect the user details
      expect(securityService.userDetails()).toEqual(userDetails);
    });
  });
});
