import {
  camelCase,
  differenceWith,
  entries,
  fromPairs,
  isEqual,
  isNil,
  mapKeys,
  negate,
  pickBy,
  unionWith,
} from 'lodash-es';

import { MultiSelectOption } from '../../common/models/multy-select.model';
import { MultiselectItem } from '../../shared/models/multiselect.model';
import { ElementRef } from '@angular/core';

export class CommonUtil {
  // Regular expression for inputs who allow only letters and numbers
  public static regexForOnlyLettersAndNumbers = /^[A-Za-z0-9 ]+$/;

  // Regular expression for inputs who allow only letters
  public static regexForOnlyLetters = /^[A-Za-z]+$/;

  // Regular expression for inputs who allow only letters, numbers and 2 special characters
  public static regexForLettersAndTwoSpecialCharacters = /^[A-Za-z0-9_\- ]+$/;

  // Regular expression for inputs who allow only letters and special characters like .
  public static regexForAddress = /[A-Za-z0-9.,_:'`\- ]*/;

  // Regular expression for inputs who allow only letters and special characters like .
  public static regexForCompanyCode = /^[A-Za-z0-9#\- ]+$/;

  // Regular expression for inputs who allow only letters and special characters like .
  public static regexForPhone = /^[\d ()+-]+$/;

  // Regular expression for inputs who allow only letters and special characters like .
  public static regexForSupportDifferentLanguages = /[ÀÈÌÒÙ àèìòù ÁÉÍÓÚ Ý áéíóúý ÂÊÎÔÛ âêîôû ÃÑÕ ãñõ ÄËÏÖÜŸ äëïöüŸ ¡¿çÇŒœ ßØøÅå ÆæÞþ Ðð]*/;

  public static changesBetween<T extends object>(object: T, comparator: T): Partial<T> {
    const diff = fromPairs(
      unionWith(
        differenceWith(entries(object), entries(comparator), isEqual),
        differenceWith(entries(comparator), entries(object), isEqual),
      ),
    ) as Partial<T>;

    return Object.keys(diff).reduce((result, key) => {
      result[key] = comparator[key];

      return result;
    }, {});
  }

  public static clearObject<T extends object>(obj: T): Partial<T> {
    return pickBy(obj, negate(isNil)) as Partial<T>;
  }

  public static keysToCamelCase<T>(obj: object): T {
    return mapKeys(obj, (value, key) => camelCase(key)) as any;
  }

  public static multiSelectOptionToItem(options: MultiSelectOption[]): MultiselectItem[] {
    return options.map(option => ({ id: option.value, name: option.display }));
  }

  public static updateCollection<T extends { id: string | number }>(
    collection: T[],
    newItem: T,
  ): T[] {
    const foundItemIndex = collection.findIndex(item => item.id === newItem.id);

    if (foundItemIndex === -1) {
      return [...collection, newItem];
    }

    const collectionClone = collection.slice();
    collectionClone.splice(foundItemIndex, 1, newItem);

    return collectionClone;
  }
}
