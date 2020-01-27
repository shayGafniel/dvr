import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  ConfigurationAPIService,
  ConfigurationResponse,
} from '../../services/configuration/configuration-api.service';
import { Category } from '../../services/configuration/configuration.model';

@Pipe({ name: 'category', pure: false })
export class CategoryIdPipe implements PipeTransform {
  private currentCategory: BehaviorSubject<Category> = new BehaviorSubject(undefined);

  constructor(private _confService: ConfigurationAPIService) {}

  public transform(value: string): Category {
    const self = this;
    this.getCategory(value).subscribe(
      (category: Category) => {
        self.currentCategory.next(category);
      },
      () => {
        self.currentCategory.next(undefined);
      },
    );
    return this.currentCategory.getValue();
  }

  private getCategory(code: string): Observable<Category> {
    return this._confService.responseObserver().pipe(
      mergeMap((confResponse: ConfigurationResponse) => {
        return of(confResponse.config.categoryById(code));
      }),
    );
  }
}
