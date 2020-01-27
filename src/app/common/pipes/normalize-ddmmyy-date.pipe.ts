import { Pipe, PipeTransform } from '@angular/core';

// normalize dd/mm/yyyy to mm/dd/yyyy so angular date pipe will be able to work withit
@Pipe({ name: 'NormalizeDdmmyyyy' })
export class NormalizeDdmmyyyyDate implements PipeTransform {
  public transform(input: string): string {
    return `${input.substring(3, 5)}/${input.substring(0, 2)}/${input.substring(6, 10)}`;
  }
}
