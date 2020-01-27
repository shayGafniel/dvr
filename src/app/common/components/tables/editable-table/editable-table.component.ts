/**
 * Created by omri marcovitch on 17/01/18.
 */
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  IterableDiffers,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AutoCompleteConf, Column, HeaderName, Row, TableConf } from '../table-component.model';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../common-dialog/types/confirm-dialog.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'common-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss'],
})
export class EditableTableComponent implements OnInit, DoCheck {
  @Input()
  public editTableConf: TableConf;
  @Output()
  public editableTableFormGroup = new EventEmitter<FormGroup>();
  @Output()
  public deleteRow = new EventEmitter<Row>();
  @Output()
  public addRow = new EventEmitter<Row>();
  @ViewChild('inputAutoComplete', { static: false })
  public inputACRef: ElementRef;

  public isEditablePanelOpen = false;
  public tableFormGroup: FormGroup = new FormGroup({
    rows: new FormArray([]),
    newEntryRow: new FormGroup({}),
  });

  private iterableDiffer;

  constructor(private iterableDiffers: IterableDiffers, private dialog: MatDialog) {
    this.iterableDiffer = this.iterableDiffers.find([]).create(null);
  }

  public ngOnInit() {
    this.initializeComponent();
  }

  public ngDoCheck() {
    const changes = this.iterableDiffer.diff(this.editTableConf.rows);
    if (changes) {
      (this.tableFormGroup.controls.rows as FormArray).controls = [];
      this.initializeRowsFormArray();
    }
  }

  /**
   * getHeaderNamesFromConf
   * @return {string[]}
   */
  public getHeaderNamesFromConf(): string[] {
    return this.editTableConf.headersOrder;
  }

  /**
   * getNewEntryFormGroup
   */
  public getNewEntryFormGroup(): FormGroup {
    return this.tableFormGroup.controls.newEntryRow as FormGroup;
  }

  /**
   * getEditableColumnTitle
   * @param {HeaderName} columnName
   * @returns {string}
   */
  public getEditableColumnTitle(columnName: HeaderName): string {
    return columnName.concat(this.getColumnByColumnName(columnName).isRequired ? '*' : '');
  }

  /**
   * getColumnByColumnName
   * Get a columnName that represent a columnName configuration
   * @return {Column}
   */
  public getColumnByColumnName(columnName: HeaderName): Column {
    return this.editTableConf.columnsConf[columnName];
  }

  /**
   * cellValueChange
   * @param {any} newVal
   */
  public cellValueChange(newVal: any): void {
    // TODO omri handle value change here
  }

  /**
   * isEditableColumn
   * @return {boolean}
   */
  public isEditableColumn(columnName: HeaderName): boolean {
    return !!this.getColumnByColumnName(columnName).isEditable;
  }

  /**
   * isNewEntryRow
   * @return {boolean}
   */
  public isNewEntryRow(): boolean {
    return this.editTableConf.isNewEntryRow;
  }

  /**
   * getAutoCompleteConf
   * @return {AutoCompleteConf}
   */
  public getAutoCompleteConf(): AutoCompleteConf {
    return this.editTableConf.autocompleteConf;
  }

  /**
   * getAutoCompleteConf
   * @return {Row[]}
   */
  public getAutoCompleteRows(): Row[] {
    const uniqueKeyName = this.editTableConf.autocompleteConf.uniqueKeyName;
    return this.findRowsANotExistOnRowsB(
      this.editTableConf.autocompleteConf.rows,
      this.editTableConf.rows,
      uniqueKeyName,
    );
  }

  /**
   * searchAutoCompleteRows
   * Filter auto complete by search input
   */
  public searchAutoCompleteRows(): Row[] {
    let autoCompRows = this.getAutoCompleteRows();
    try {
      const searchString = this.inputACRef.nativeElement.value;
      autoCompRows = autoCompRows.filter((rowObject: Row) => {
        const valueToCheck = rowObject[this.editTableConf.autocompleteConf.keyNameToSearch];
        return new RegExp(searchString, 'gi').test(valueToCheck);
      });
    } catch (err) {
      return autoCompRows;
    }
    return autoCompRows;
  }

  /**
   * clearRow
   * Clearing the new entry row
   */
  public clearRow(): void {
    this.isEditablePanelOpen = false;
    this.getNewEntryFormGroup().reset();
  }

  /**
   * addingNewRow Emit the new row data
   * @param {Row} rowData
   */
  public addingNewRow(rowData: Row) {
    this.addRow.emit(rowData);
  }

  /**
   * deletingRow
   * @param {Row} row to delete
   */
  public deletingRow(row: Row): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.title = 'Deleting Row';
    dialogRef.componentInstance.message = 'Are you sure you want to delete this row?';
    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) {
        this.deleteRow.emit(row);
      }
    });
  }

  /**
   * getListOfFormGroupInFormArray
   * @return {AbstractControl[]}
   */
  public getListOfFormGroupInFormArray(): FormGroup[] {
    const formGroups = (this.tableFormGroup.get('rows') as FormArray).controls;
    return formGroups ? (formGroups as FormGroup[]) : [];
  }

  /**
   * getControlNameByHeader
   * @return {string}
   */
  public getControlNameByHeaderName(headerName: HeaderName): string {
    const serverKeyName = this.getColumnByColumnName(headerName).serverKeyName;
    return serverKeyName ? serverKeyName : (headerName as string);
  }

  // ******************************* Private *******************************
  /**
   * initializeComponent
   */
  private initializeComponent(): void {
    if (this.editTableConf.isNewEntryRow) {
      this.initializeFormGroup(this.getNewEntryFormGroup());
    }
    this.initializeRowsFormArray();

    // Emitting rows form group
    this.tableFormGroup.controls.rows.statusChanges.pipe(debounceTime(500)).subscribe(() => {
      this.emitFormGroup();
    });
  }

  /**
   * generateNamesOfControlsForRow
   * We want to make a form group that represent a row with the whole data of the row
   * like id's that should not appear in the ui
   * This function generate a list of control names that should represent a row
   * @param {Row} row
   * @return {string[]}
   */
  private generateNamesOfControlsForRow(row: Row): string[] {
    const rowKeys = Object.keys(row);
    const rowControlNames = [];
    this.getHeaderNamesFromConf().forEach((headerName: HeaderName) => {
      rowControlNames.push(headerName);
      if (rowKeys.includes(headerName)) {
        rowKeys.splice(rowKeys.indexOf(headerName), 1);
      } else if (rowKeys.includes(this.getColumnByColumnName(headerName).serverKeyName)) {
        rowKeys.splice(rowKeys.indexOf(this.getColumnByColumnName(headerName).serverKeyName), 1);
      }
    });
    rowControlNames.push(...rowKeys);
    return rowControlNames;
  }

  /**
   * initializeRowsFormArray
   */
  private initializeRowsFormArray(): void {
    const rows = this.editTableConf.rows ? this.editTableConf.rows : [];
    rows.forEach((row: Row) => {
      const viewRowsControlNames = this.generateNamesOfControlsForRow(row);
      const rowFormGroup = this.initializeFormGroup(new FormGroup({}), viewRowsControlNames, row);
      (this.tableFormGroup.controls.rows as FormArray).push(rowFormGroup);
    });
  }

  /**
   * initializeFormGroup
   * @param {FormGroup} formGroup
   * @param {string[]} formFields (For example: name, contactId etc...)
   * @param {Row} row
   * @return {FormGroup}
   */
  private initializeFormGroup(
    formGroup: FormGroup,
    formFields = this.getHeaderNamesFromConf(),
    row?: Row,
  ): FormGroup {
    formFields.map((formFieldName: string) => {
      const column = this.getColumnByColumnName(formFieldName);
      if (column) {
        // Here we Create a form control that will be shown in the UI
        const colValue = !!row ? row[column.serverKeyName] : '';
        const validators = column.isRequired ? [Validators.required] : [];
        if (!!column.validators) validators.push(...column.validators);
        // Adding new form control
        formGroup.addControl(
          this.getControlNameByHeaderName(formFieldName),
          new FormControl(colValue, validators),
        );
      } else {
        // Here we Create a form control for a fields that will not be shown in the UI Like id
        formGroup.addControl(formFieldName, new FormControl(row[formFieldName]));
      }
    });
    return formGroup;
  }

  /**
   * emitFormGroup
   */
  private emitFormGroup(): void {
    this.editableTableFormGroup.emit(this.tableFormGroup.controls.rows as FormGroup);
  }

  /**
   * findRowsANotExistOnRowsB Find out which rows in rowsA are not exist on rowsB
   * @param {Row[]} listA
   * @param {Row[]} listB
   * @param {string} uniqueKey
   */
  private findRowsANotExistOnRowsB(rowsA: Row[], rowsB: Row[], uniqueKey: string): Row[] {
    rowsA = !rowsA || rowsA.length < 1 ? [] : rowsA;
    if (!rowsB || rowsB.length < 1) {
      return rowsA;
    }
    return rowsA.filter((rowA: Row) => {
      return !rowsB.find((rowB: Row) => rowB[uniqueKey] === rowA[uniqueKey]);
    });
  }
}
