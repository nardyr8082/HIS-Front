import { MetaTableField } from './../../models/MetaTableField/MetaTableField.model';
import { MetaField } from './../../models/MetaField/MetaField.model';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MetaTableName } from '../../models/MetaTable/MetaTable.model';

@Component({
  selector: 'app-dynamic-table-form',
  templateUrl: './dynamic-table-form.component.html',
  styleUrls: ['./dynamic-table-form.component.scss'],
})
export class DynamicTableFormComponent implements OnInit, OnChanges {
  @Input() metaTableName: MetaTableName;
  @Input() metaFields: MetaField[];
  @Input() metaTableFields: MetaTableField[];

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  fieldsFromTable: MetaTableField[] = [];

  metaTableForm: FormGroup;
  metaFieldForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.buildForm();
    if (this.metaTableFields) {
      this.fieldsFromTable = this.metaTableFields;
    }
  }

  buildForm() {
    this.metaTableForm = this._formBuilder.group({
      id: [this.metaTableName ? this.metaTableName.id : ''],
      mtn_tablename: [this.metaTableName ? this.metaTableName.mtn_tablename : '', [Validators.required, Validators.minLength(4)]],
    });

    this.metaFieldForm = this._formBuilder.group({
      mtf_fieldname: ['', [Validators.required]],
      mf: ['', [Validators.required]],
    });
  }

  clearFieldFormData() {
    this.metaFieldForm = this._formBuilder.group({
      mtf_fieldname: ['', [Validators.required]],
      mf: ['', [Validators.required]],
    });
  }

  addFieldToList(field) {
    this.fieldsFromTable.push(field);
    this.clearFieldFormData();
  }

  deleteFieldFromTable(field) {
    this.fieldsFromTable = this.fieldsFromTable.filter((f) => f.mtf_fieldname != field.mtf_fieldname);
  }

  onSubmit() {
    const data = { tableName: this.metaTableForm.value, fields: this.fieldsFromTable };
    this.metaTableName ? this.edit.emit({ ...data }) : this.create.emit({ ...data });
  }
}
