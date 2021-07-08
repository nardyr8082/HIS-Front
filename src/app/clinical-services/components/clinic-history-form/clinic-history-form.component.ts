import { MetaTableField } from './../../models/MetaTableField/MetaTableField.model';
import { MetaTableFieldService } from './../../services/metaTableField.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ClinicHistory } from './../../models/CLinicHistory/clinicHistory.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetaTableName } from '../../models/MetaTable/MetaTable.model';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clinic-history-form',
  templateUrl: './clinic-history-form.component.html',
  styleUrls: ['./clinic-history-form.component.scss'],
})
export class ClinicHistoryFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() clinicHistory: ClinicHistory;
  @Input() metaTableNames: MetaTableName[] = [];

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  metaTableFields: MetaTableField[];
  metaFieldsForms: FormGroup[];

  subscriptions: Subscription[] = [];

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private metaTableFieldService: MetaTableFieldService) {}

  ngOnInit(): void {}

  ngOnChanges() {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildFieldsForm(metaTableFields: MetaTableField[]) {
    this.metaFieldsForms = [];
    metaTableFields.forEach((field) => {
      const fieldForm = this._formBuilder.group({
        name: [{ value: field.mtf_fieldname, disabled: true }],
        mtf: [field.id, Validators.required],
        data_value: ['', Validators.required],
      });
      this.metaFieldsForms.push(fieldForm);
    });
  }

  onChangeTable(tableId) {
    this.getMetafields(tableId);
  }

  getMetafields(tableId) {
    const sub = this.metaTableFieldService
      .getMetaTableFields({ mtn__id: tableId }, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.metaTableFields = response.results;
          this.buildFieldsForm(this.metaTableFields);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  validForms() {
    let flag = true;
    if (this.metaFieldsForms) {
      this.metaFieldsForms.forEach((f) => {
        if (f.invalid) {
          flag = false;
        }
      });
    } else {
      flag = false;
    }
    return flag;
  }

  onSubmit() {
    const data = this.metaFieldsForms.map((form) => form.value);
    this.clinicHistory ? this.edit.emit({}) : this.create.emit(data);
  }
}
