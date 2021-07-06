import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MetaTableName } from '../../models/MetaTable/MetaTable.model';

@Component({
  selector: 'app-dynamic-table-form',
  templateUrl: './dynamic-table-form.component.html',
  styleUrls: ['./dynamic-table-form.component.scss'],
})
export class DynamicTableFormComponent implements OnInit {
  @Input() metaTableName: MetaTableName;

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  metaTableForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.metaTableForm = this._formBuilder.group({
      mtn_tablename: [this.metaTableName ? this.metaTableName.mtn_tablename : '', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit() {}
}
