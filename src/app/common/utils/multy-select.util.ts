import { isObject } from 'lodash-es';

import { MultiSelectOption } from '../models/multy-select.model';

export class MultiSelectUtil {
  public static getDisplayByValue(options: MultiSelectOption[], value: string): string {
    const foundOption = options.find(option => option.value === value);

    return isObject(foundOption) ? foundOption.display : '';
  }
}
