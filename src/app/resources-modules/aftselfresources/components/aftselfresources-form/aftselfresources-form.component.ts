import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { AftselfresourcesService } from '../../services/aftselfresources.service';

@Component({
  selector: 'app-aftselfresources-form',
  templateUrl: './aftselfresources-form.component.html',
  styleUrls: ['./aftselfresources-form.component.scss'],
})
export class AftselfresourcesFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  aftselfresourcesForm: FormGroup;
  id_estado: any = [];
  id_recurso: any = [];
  id_departamento: any = [];
  paciente: any = [];
  subscriptions: Subscription[] = [];

  constructor(public aftselfresourcesService: AftselfresourcesService, public dialogRef: MatDialogRef<AftselfresourcesFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getOffice();
    this.getStatus();
    this.getPatient();
    this.getClassificator();

  }

  ngOnDestroy() {
    this.subscriptions;
  }
  getClassificator() {
    const sub = this.aftselfresourcesService
      .getClassificator()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.id_recurso = response.results;
          console.log(this.id_recurso);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getStatus() {
    const sub = this.aftselfresourcesService
      .getStatus()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.id_estado = response.results;
          console.log(this.id_estado);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getOffice() {
    const sub = this.aftselfresourcesService
      .getOffice()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.id_departamento = response.results;
          console.log(this.id_departamento);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getPatient() {
    const sub = this.aftselfresourcesService
      .getPatient()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.paciente = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.aftselfresourcesForm = new FormGroup({
      nro_inventario: new FormControl(this.data.aftselfresources ? this.data.aftselfresources.nro_inventario : '', Validators.required),
      activo: new FormControl(this.data.aftselfresources ? this.data.aftselfresources.activo : ''),
      id_estado: new FormControl(this.data.aftselfresources ? this.data.aftselfresources.id_estado_id : '', Validators.required),
      id_recurso: new FormControl(this.data.aftselfresources ? this.data.aftselfresources.id_recurso_id : '', Validators.required),
      id_departamento: new FormControl(this.data.aftselfresources ? this.data.aftselfresources.id_departamento_id : '', Validators.required),
      paciente: new FormControl(this.data.aftselfresources ? this.data.aftselfresources.paciente_id : '', Validators.required),
    });
  }
  get numberControl() {
    return this.aftselfresourcesForm?.get('nro_inventario') as FormControl;
  }
  get activeControl() {
    return this.aftselfresourcesForm?.get('activo') as FormControl;
  }

  get statusControl() {
    return this.aftselfresourcesForm?.get('id_estado') as FormControl;
  }

  get classificatorControl() {
    return this.aftselfresourcesForm?.get('id_recurso') as FormControl;
  }

  get officeControl() {
    return this.aftselfresourcesForm?.get('id_departamento') as FormControl;
  }
  get patientControl() {
    return this.aftselfresourcesForm?.get('paciente') as FormControl;
  }

  onSubmit(data) {
    this.data.aftselfresources ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
