import { async, TestBed } from '@angular/core/testing';

import { CookiesService } from './cookies.service';

const cookieName = 'name';
const cookieValue = 'value';

describe('CookiesService', () => {
  let cookieService: CookiesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CookiesService],
    });
  }));

  beforeEach(() => {
    cookieService = TestBed.get(CookiesService);
  });

  function setCookie(): void {
    cookieService.setCookie(cookieName, cookieValue, 1);
  }

  it('should be created', () => {
    expect(cookieService).toBeTruthy();
  });

  it('should set cookie', () => {
    setCookie();

    const receivedCookieValue = cookieService.getCookie(cookieName);

    expect(receivedCookieValue).toBe(
      cookieValue,
      'received cookie is not matched with original value',
    );
  });
});
