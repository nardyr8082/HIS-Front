import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dynamic-table-nomenclator-form',
  templateUrl: './dynamic-table-nomenclator-form.component.html',
  styleUrls: ['./dynamic-table-nomenclator-form.component.scss'],
})
export class DynamicTableNomenclatorFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  metaFieldForm: FormGroup;
  subscriptions: Subscription[] = [];

  nomenclatorTypes = [
    { id: 'varchar', name: 'varchar' },
    { id: 'bool', name: 'bool' },
    { id: 'float', name: 'float' },
    { id: 'int', name: 'int' },
    { id: 'date', name: 'date' },
    { id: 'datetime', name: 'datetime' },
    { id: 'time', name: 'time' },
    { id: 'uuid', name: 'uuid' },
    { id: 'text', name: 'text' },
    { id: 'json', name: 'json' },
  ];

  constructor(public dialogRef: MatDialogRef<DynamicTableNomenclatorFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  buildForm() {
    this.metaFieldForm = new FormGroup({
      mf_datatype: new FormControl(this.data.metaField ? this.data.metaField.mf_datatype : '', Validators.required),
      mf_validchars: new FormControl(this.data.metaField ? this.data.metaField.mf_validchars : '', [Validators.required, Validators.maxLength(3), Validators.max(255), Validators.min(1)]),
    });
  }

  onSubmit(data) {
    this.data.metaField ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
