import { Injectable } from '@angular/core';

@Injectable()
export class CookiesService {
  // noinspection JSMethodCanBeStatic
  public getCookie(name: string) {
    const ca: Array<string> = document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = name + '=';
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }

    return '';
  }

  // noinspection JSMethodCanBeStatic
  public deleteCookie(name: string) {
    const domain: string = new RegExp('k8rnd').test(window.location.href)
      ? 'k8rnd.vatbox.com'
      : 'vatbox.com';
    document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/; domain=${domain};`;
  }

  // noinspection JSMethodCanBeStatic
  public setCookie(name: string, value: string, expireDays: number, path = '') {
    const d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie =
      name + '=' + value + '; ' + expires + (path.length > 0 ? '; path=' + path : '');
  }
}
