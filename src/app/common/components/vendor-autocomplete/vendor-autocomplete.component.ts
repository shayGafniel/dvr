import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';
import { debounceTime, startWith } from 'rxjs/operators';

import { Vendor } from '../../services/vendor-management/vendor-management.model';

@Component({
  selector: 'common-vendor-autocomplete',
  templateUrl: 'vendor-autocomplete.component.html',
  styleUrls: ['vendor-autocomplete.component.scss'],
})
export class VendorAutocompleteComponent implements AfterViewInit {
  public filteredVendors: Vendor[] = [];
  public vendorList: Vendor[] = [];
  public vendorCtrl: FormControl = new FormControl();
  public term = '';

  @ViewChild('input', { read: MatAutocompleteTrigger, static: false })
  public autoComplete: MatAutocompleteTrigger;
  @Input()
  public placeholder = '';
  @Input()
  public selectedVendors: Vendor[] = [];

  @Input()
  set vendors(vendors: Vendor[]) {
    if (!!vendors && vendors.length > 0) {
      this.vendorList = vendors;
      if (!!this.vendorCtrl.value) {
        this.filteredVendors = vendors.filter((vendor: Vendor) => {
          return new RegExp(this.vendorCtrl.value, 'gi').test(vendor.formalName);
        });
      }
    }
  }

  @Output()
  public selectedVendor = new EventEmitter<Vendor>();
  @Output()
  public getVendorList = new EventEmitter<string>();

  constructor() {
    this.vendorCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
      )
      .subscribe((term: string) => {
        if (term.length > 0) {
          if (this.term !== term) {
            this.term = term;
            this.getVendorList.emit(term);
          }
        } else {
          this.term = '';
          this.getSelectedVendors();
        }
      });
  }

  public ngAfterViewInit(): void {
    this.autoComplete.panelClosingActions.subscribe(() => {
      this.vendorCtrl.setValue('');
    });
  }

  public selectVendor(selected: MatAutocompleteSelectedEvent): void {
    this.selectedVendor.emit(selected.option.value);
    this.vendorCtrl.setValue(this.term);
    setTimeout(() => {
      this.autoComplete.openPanel();
    });
  }

  public getSelectedVendors() {
    this.filteredVendors = this.vendorList.filter((vendor: Vendor) =>
      this.selectedVendors.map(selectedVendor => selectedVendor.vendorId).includes(vendor.vendorId),
    );
  }

  public isVendorSelected(vendorId: number): boolean {
    return this.selectedVendors.map(vendor => vendor.vendorId).includes(vendorId);
  }
}
