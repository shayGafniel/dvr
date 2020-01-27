import { Pipe, PipeTransform } from '@angular/core';
import * as NumberAbbreviate from 'number-abbreviate';

export enum AbbreviateNumberStrategy {
  Library = 'library',
  Local = 'local',
}

@Pipe({
  name: 'abbreviateNumber',
})
export class AbbreviateNumberPipe implements PipeTransform {
  public static abbreviateNumber(value: number, fractionDigits: number): string {
    if (value >= 1000) {
      const suffixes = ['', 'k', 'm', 'b', 't'];
      const suffixNum = Math.floor(value.toString().length / 3);
      let shortValue = 0;

      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision),
        );
        const dotLessShortValue = shortValue.toString().replace(/[^a-zA-Z 0-9]+/g, '');

        if (dotLessShortValue.length <= 2) {
          break;
        }
      }

      if (shortValue % 1 !== 0) {
        return shortValue.toFixed(fractionDigits) + suffixes[suffixNum];
      }

      return shortValue + suffixes[suffixNum];
    }

    return value.toString();
  }

  public transform(
    value: number,
    fractionDigits: number,
    strategy?: AbbreviateNumberStrategy,
  ): string {
    const preparedValue = this.prepareValue(value);

    switch (strategy) {
      case AbbreviateNumberStrategy.Local:
        return AbbreviateNumberPipe.abbreviateNumber(preparedValue, fractionDigits);

      case AbbreviateNumberStrategy.Library:
      default:
        return new NumberAbbreviate().abbreviate(preparedValue, fractionDigits);
    }
  }

  // noinspection JSMethodCanBeStatic
  private prepareValue(value: number): number {
    return Math.round(value);
  }
}
