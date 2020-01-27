import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceCurrencyFormatter',
})
export class SpaceCurrencyFormatterPipe implements PipeTransform {
  public transform(value: string, args?: any): string {
    if (!!value) {
      return value
        .split(/([\d\,]+)/)
        .filter(Boolean).join(' ');
    }
    return value;
  }
}
