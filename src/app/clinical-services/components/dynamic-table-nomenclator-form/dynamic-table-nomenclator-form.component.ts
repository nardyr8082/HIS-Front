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
      mf_validchars: new FormControl(this.data.metaField ? this.data.metaField.mf_validchars : '', Validators.required),
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
