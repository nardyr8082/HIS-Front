import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tax-form',
  templateUrl: './tax-form.component.html',
  styleUrls: ['./tax-form.component.scss'],
})
export class TaxFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  taxForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<TaxFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.taxForm = new FormGroup({
      descripcion: new FormControl(this.data.tax ? this.data.tax.descripcion : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
      importe_fijo: new FormControl(this.data.tax ? this.data.tax.importe_fijo : '',[Validators.required ,Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+')]),
      importe_proporcional: new FormControl(this.data.tax ? this.data.tax.importe_proporcional : '',[Validators.required ,Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+')]),
    });
  }

  get nameTaxControl() {
    return this.taxForm?.get('descripcion') as FormControl;
  }

  get importeFTaxControl() {
    return this.taxForm?.get('importe_fijo') as FormControl;
  }

  get importePTaxControl() {
    return this.taxForm?.get('importe_proporcional') as FormControl;
  }

  onSubmit(data) {
    this.data.tax ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
