import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-status-form',
  templateUrl: './invoice-status-form.component.html',
  styleUrls: ['./invoice-status-form.component.scss'],
})
export class InvoiceStatusFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  invoiceStatusForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<InvoiceStatusFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.invoiceStatusForm = new FormGroup({
      descripcion: new FormControl(this.data.invoiceStatus ? this.data.invoiceStatus.descripcion : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
    });
  }

  get nameInvoiceStatusControl() {
    return this.invoiceStatusForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.invoiceStatus ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
