import { ClinicHistoryService } from './../../services/clinic-history.service';
import { MetaTableField } from './../../models/MetaTableField/MetaTableField.model';
import { MetaTableFieldService } from './../../services/metaTableField.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ClinicHistory } from './../../models/CLinicHistory/clinicHistory.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetaTableName } from '../../models/MetaTable/MetaTable.model';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

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
  tableNameId;

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private metaTableFieldService: MetaTableFieldService,
    private router: Router,
    private route: ActivatedRoute,
    private dataRecordService: ClinicHistoryService,
  ) {
    this.route.params.subscribe((params) => {
      this.tableNameId = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.tableNameId) {
      this.metaTableNames = this.metaTableNames.filter((mtn) => mtn.id == this.tableNameId);
      this.onChangeTable(this.tableNameId);
    }
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildFieldsForm(metaTableFields: MetaTableField[]) {
    this.route.queryParams.subscribe((params) => {
      this.metaFieldsForms = [];
      metaTableFields.forEach((field) => {
        const fieldForm = this._formBuilder.group({
          id: [params[`id_${field.mtf_fieldname}`] ? params[`id_${field.mtf_fieldname}`] : null],
          name: [{ value: field.mtf_fieldname, disabled: true }],
          mtf: [field.id, Validators.required],
          data_value: [params[field.mtf_fieldname] ? params[field.mtf_fieldname] : '', Validators.required],
        });
        if (this.tableNameId) {
          this.dataRecordService
            .getClicnicHistoryById(params[`id_${field.mtf_fieldname}`])
            .pipe(
              map((response) => {
                fieldForm.addControl('table_record_id', new FormControl(response.table_record_id));
                this.metaFieldsForms.push(fieldForm);
              }),
            )
            .subscribe();
        } else {
          this.metaFieldsForms.push(fieldForm);
        }
      });
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
    this.tableNameId ? this.edit.emit(data) : this.create.emit(data);
  }
}
