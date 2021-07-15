import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-indicator-type-form',
  templateUrl: './indicator-type-form.component.html',
  styleUrls: ['./indicator-type-form.component.scss'],
})
export class IndicatorTypeFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  indicatorTypeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<IndicatorTypeFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.indicatorTypeForm = new FormGroup({
      id: new FormControl(this.data?.indicatorType?.id ? this.data?.indicatorType.id : null),
      descripcion: new FormControl(this.data?.indicatorType?.descripcion ? this.data?.indicatorType.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get idControl() {
    return this.indicatorTypeForm.get('id') as FormControl;
  }

  get descripcionControl() {
    return this.indicatorTypeForm.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.indicatorType ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
