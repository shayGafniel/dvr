import { Injectable } from '@angular/core';

@Injectable()
export class WindowRefService {
  //noinspection JSMethodCanBeStatic
  get nativeWindow(): Partial<Window> {
    return window;
  }
}
