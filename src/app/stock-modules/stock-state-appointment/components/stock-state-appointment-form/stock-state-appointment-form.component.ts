import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-stock-state-appointment-form',
  templateUrl: './stock-state-appointment-form.component.html',
  styleUrls: ['./stock-state-appointment-form.component.scss'],
})
export class StockStateAppointmentFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  stockStateAppointmentForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<StockStateAppointmentFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.stockStateAppointmentForm = new FormGroup({
      id: new FormControl(this.data?.stockStateAppointment?.id ? this.data?.stockStateAppointment.id : null),
      descripcion: new FormControl(this.data?.stockStateAppointment?.descripcion ? this.data?.stockStateAppointment.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get idControl() {
    return this.stockStateAppointmentForm.get('id') as FormControl;
  }

  get descripcionControl() {
    return this.stockStateAppointmentForm.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.stockStateAppointment ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
