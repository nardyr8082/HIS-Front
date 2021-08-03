import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatientService } from '../../../../patient/services/patient.service';



@Component({
  selector: 'app-pinpaciente-form',
  templateUrl: './pinpaciente-form.component.html',
  styleUrls: ['./pinpaciente-form.component.scss'],
})
export class PinpacienteFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  show: boolean;
  pinpacienteForm: FormGroup;
  ids: any = [];
  subscriptions: Subscription[] = [];

  constructor(public patientService: PatientService, public dialogRef: MatDialogRef<PinpacienteFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.getUser();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions;
  }
  buildForm() {
    console.log('build form data', this.data);
    console.log('build form pinpaciente', this.data.pinpaciente);
    if (this.data === null )
      this.show = true;
    else
      this.show = false;
    this.pinpacienteForm = new FormGroup({
      id: new FormControl(this.data.pinpaciente ? this.data.pinpaciente.id : this.ids),
      pin_anterior: new FormControl(this.data.pinpaciente ? this.data.pinpaciente.pin_anterior : '0000'),
      pin_nuevo: new FormControl( this.data.pinpaciente ? this.data.pinpaciente.pin_nuevo : ''),
      pin_confirmar: new FormControl(this.data.pinpaciente ? this.data.pinpaciente.pin_confirmar : ''),
    });
    console.log('mensaje form:', this.pinpacienteForm);
  }
  get pinLastControl() {
    return this.pinpacienteForm?.get('pin_anterior') as FormControl;
  }
  get pinNewControl() {
    return this.pinpacienteForm?.get('pin_nuevo') as FormControl;
  }
  get pinConfirmControl() {
    return this.pinpacienteForm?.get('pin_confirmar') as FormControl;
  }
  get idControl() {
    return this.pinpacienteForm?.get('id') as FormControl;
  }
  getUser() {
    const sub = this.patientService
      .getPatients({ pin: '0000' }, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.ids = response.results;
          console.log('mora los ids', this.ids);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onSubmit(data) {
    console.log('Estoy en el submit', data);
    let valores = {};
    valores['id'] = data['id'];
    valores['pin'] = data['pin_confirmar'];
    this.edit.emit(valores);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
