import { Pipe, PipeTransform } from '@angular/core';

import { Category } from '../../services/configuration/configuration.model';

const categoryGroupDictionary = {
  justifications: 'JUSTIFICATION',
  evidences: 'EVIDENCE',
  itemizedLevel: 'ITEMIZED_LEVEL',
};

@Pipe({ name: 'categoryGroup' })
export class CategoryGroupPipe implements PipeTransform {
  public transform(categoriesInput: Category[], ...groupCodes: string[]): Category[] {
    let filtered: Category[] = [];
    if (groupCodes.length === 0) {
      filtered = categoriesInput;
    } else {
      groupCodes.forEach((groupCode: string) => {
        filtered.push(
          ...categoriesInput.filter((category: Category) => {
            return (
              category.group.includes(categoryGroupDictionary[groupCode]) &&
              !filtered.some((c: Category) => c.id === category.id)
            );
          }),
        );
      });
    }

    return filtered;
  }
}
