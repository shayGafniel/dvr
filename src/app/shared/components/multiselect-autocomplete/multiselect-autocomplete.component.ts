import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';

import { MultiselectItem } from '../../models/multiselect.model';

@Component({
  selector: 'app-multiselect-autocomplete',
  templateUrl: './multiselect-autocomplete.component.html',
  styleUrls: ['./multiselect-autocomplete.component.scss'],
})
export class MultiselectAutocompleteComponent<T extends MultiselectItem>
  implements OnDestroy, OnInit {
  @Input()
  public componentLabel: string;

  @Input()
  public defaultSelectAllItem: T;

  @Input()
  public displayName = 'name';

  @Input()
  public set items(items: T[]) {
    this.itemObjs = items;
    this.filteredItems$.next(items);
  }

  @Input()
  public keyName: string;

  @Input()
  public set selectedItems(items: T[]) {
    if (items) {
      this.selectedItemObjs = items;
      this.initialSelectionIds = items.map(i => i[this.keyName]);
      this.selectedItemIds = items.map(i => i[this.keyName]);
    }
  }

  @Output()
  public selectionEnded = new EventEmitter<T[]>();

  @ViewChild('searchAutofocus', {static: false})
  public searchAutofocus: ElementRef;

  public filterControl = new FormControl();
  public filteredItems$ = new BehaviorSubject<T[]>([]);
  public selectedItemIds: number[] = [];
  public selectedItemObjs: T[] = [];
  public isSelectedAllItems: boolean;
  public selectedItem: string;
  public allItems: T[];

  private initialSelectionIds: number[];
  private inputSubscription: Subscription;
  private itemObjs: T[];

  constructor() {
  }

  public ngOnInit() {
    this.inputSubscription = this.filterControl.valueChanges.subscribe(val => {
      this.resetHiddenOptions();
      if (val) {
        this.itemObjs.forEach(i => {
          if (i && !i[this.displayName].toLowerCase().includes(val.toLowerCase())) {
            i['_autocomplete_dropdown_hidden'] = true;
          }
        });
      }
      this.filteredItems$.next(this.itemObjs);
    });
  }

  public ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }

  public selectionChanged(event): void {
    let items = event.value;

    if (this.selectedItem === this.defaultSelectAllItem[this.keyName]) {
      if (this.isSelectedAllItems) {
        this.filteredItems$.pipe(take(1)).subscribe(value => items = value.map(el => el[this.keyName]));
      } else {
        items = [this.defaultSelectAllItem[this.keyName]];
      }
    } else {
      if (items.length === 0) {
        items = [this.defaultSelectAllItem[this.keyName]];
      } else {
        items = items.filter(i => i !== this.defaultSelectAllItem[this.keyName]);
      }
    }
    this.allItems = this.itemObjs;

    this.selectedItemIds = items;
    this.setSelectedItemValues(items);
  }

  public changeOption(event): void {
    this.selectedItem = event.source.value;
    if (event.isUserInput && this.selectedItem === this.defaultSelectAllItem[this.keyName]) {
      this.itemObjs.length === this.selectedItemObjs.length ? this.isSelectedAllItems = false : this.isSelectedAllItems = true;
    }
  }

  public dropdownStateChanges(dropdownOpened: boolean): void {
    if (dropdownOpened) {
      // Handle search input focus
      this.searchAutofocus.nativeElement.focus();
    } else {
      // Emit event when selection ended
      if (this.selectedItemsChanged()) {
        this.resetHiddenOptions();
        this.selectionEnded.emit(this.selectedItemObjs);
      }
    }
  }

  private itemIsSelected(item): boolean {
    return this.selectedItemObjs.map(i => i[this.keyName]).includes(item[this.keyName]);
  }

  private selectedItemsChanged(): boolean {
    const csids = this.selectedItemObjs.map(i => i[this.keyName]);
    const isids = this.initialSelectionIds;
    return !(
      csids.length === isids.length && csids.every((value, index) => value === isids[index])
    );
  }

  private resetHiddenOptions(): void {
    this.itemObjs.forEach(i => delete i['_autocomplete_dropdown_hidden']);
  }

  private setSelectedItemValues(itemIds): void {
    this.selectedItemObjs = this.itemObjs.filter(i => itemIds.includes(i[this.keyName]));
  }
}
