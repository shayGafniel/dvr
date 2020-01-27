import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column, HeaderName, TableCellTypes } from '../table-component.model';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'common-customize-table-cell',
  templateUrl: './customize-table-cell.component.html',
  styleUrls: ['./customize-table-cell.component.scss'],
})
export class CustomizeTableCellComponent {
  @Output()
  public valueChange: EventEmitter<any> = new EventEmitter<any>(); // TODO omri set a type
  @Input()
  public isWrapWithCard = false;
  @Input()
  public column: Column;
  @Input()
  public headerName: HeaderName;
  @Input()
  public formGroup: FormGroup;
  @Input()
  public cellValue: any;

  public readonly maxInputLength = 30;
  public tableCellTypes = TableCellTypes;

  /**
   * getPlaceHolder
   * If the placeholder has not been provided the placeholder will be the columnName header name
   * @returns {string}
   */
  public getPlaceHolder(): string {
    return this.column.placeholder ? this.column.placeholder : this.headerName;
  }

  /**
   * getTableCellTypeString
   * For example: Input, Datapicker, select etc...
   * @returns {string}
   */
  public getTableCellTypeString(): string {
    return TableCellTypes[this.column.type];
  }

  /**
   * getFormControlName
   * @return {string}
   */
  public getFormControlName(): string {
    return this.column.serverKeyName ? this.column.serverKeyName : this.headerName;
  }

  /**
   * getCellFormControl
   * @returns {AbstractControl}
   */
  public getCellFormControl(): AbstractControl {
    return this.formGroup.get(this.getFormControlName());
  }

  /**
   * valueChange
   * @param {any} newVal
   */
  public emitValueChange(newVal: any): void {
    this.valueChange.emit(newVal);
  }
}
