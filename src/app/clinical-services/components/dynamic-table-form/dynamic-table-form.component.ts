import { MetaTableFieldService } from './../../services/metaTableField.service';
import { MetaTableField } from './../../models/MetaTableField/MetaTableField.model';
import { MetaField } from './../../models/MetaField/MetaField.model';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MetaTableName } from '../../models/MetaTable/MetaTable.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { filter, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-table-form',
  templateUrl: './dynamic-table-form.component.html',
  styleUrls: ['./dynamic-table-form.component.scss'],
})
export class DynamicTableFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() metaTableName: MetaTableName;
  @Input() metaFields: MetaField[];
  @Input() metaTableFields: MetaTableField[];

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  fieldsFromTable: MetaTableField[] = [];

  metaTableForm: FormGroup;
  metaFieldForm: FormGroup;

  subscriptions: Subscription[] = [];

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private metaTableFieldService: MetaTableFieldService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.buildForm();
    if (this.metaTableFields) {
      this.fieldsFromTable = this.metaTableFields;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.metaTableForm = this._formBuilder.group({
      id: [this.metaTableName ? this.metaTableName.id : ''],
      mtn_tablename: [this.metaTableName ? this.metaTableName.mtn_tablename : '', [Validators.required, Validators.minLength(4)]],
    });

    this.metaFieldForm = this._formBuilder.group({
      mtf_fieldname: ['', [Validators.required, Validators.pattern('^(?!id$)')]],
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
    if (this.metaTableName) {
      this.createMetaTableField(this.metaTableName);
    } else {
      this.fieldsFromTable.push(field);
    }
    this.clearFieldFormData();
  }

  deleteFieldFromTable(field) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el campo: ${field.mtf_fieldname}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        map(() => {
          this.fieldsFromTable = this.fieldsFromTable.filter((f) => f.mtf_fieldname != field.mtf_fieldname);
          if (field.id) {
            this.removeMetaTableField(field.id);
          }
        }),
      )
      .subscribe();

    const sub1 = modalComponentRef.cancel.pipe(tap(() => modalRef.close())).subscribe();
    this.subscriptions.push(sub, sub1);
  }

  onSubmit() {
    const data = { tableName: this.metaTableForm.value, fields: this.fieldsFromTable };
    this.metaTableName ? this.edit.emit(this.metaTableForm.value) : this.create.emit({ ...data });
  }

  removeMetaTableField(id) {
    const sub = this.metaTableFieldService.deleteMetaTableField(id).subscribe();
    this.subscriptions.push(sub);
  }

  createMetaTableField(metaTableName) {
    const data = this.metaFieldForm.value;
    data.mtn = metaTableName.id;
    const sub = this.metaTableFieldService
      .createMetaTableField(data)
      .pipe(
        map((response) => {
          this.fieldsFromTable.push(response);
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }
}
