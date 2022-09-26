import { Component, EventEmitter, Inject, OnDestroy, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { ClinicHistoryStaticService } from '../services/clinic-history-static.service';
import { PatientService } from 'src/app/patient/services/patient.service';
import { Patient } from 'src/app/patient/models/patient.model';
import { ClinicHistoryStatic } from '../models/clinic-history-static.model';
@Component({
  selector: 'app-clinic-history-static-form',
  templateUrl: './clinic-history-static-form.component.html',
  styleUrls: ['./clinic-history-static-form.component.scss']
})
export class ClinicHistoryStaticFormComponent implements OnInit {
  @Input() item='';
 
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
 /*  @Input() clinicHistoryStaticM: ClinicHistoryStatic;
  @Input() patientM: Patient[]; */

  clinicHistoryStaticForm: FormGroup;
  patient: any = [];
  subscriptions: Subscription[] = [];
  constructor(
    public clinicHistoryStaticService: ClinicHistoryStaticService,
    private patientservice: PatientService,
    public dialogRef: MatDialogRef<ClinicHistoryStaticFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.buildForm();
    this.getPatient();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getPatient() {
    const sub = this.patientservice
      .getPatients({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.patient = response.results;

        }),

      ).subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {

    this.clinicHistoryStaticForm = new FormGroup({
      numero_hc: new FormControl(this.data.clinicHistoryStatic ? this.data.clinicHistoryStatic.numero_hc : '', Validators.required),
      paciente: new FormControl(this.data.clinicHistoryStatic ? this.data.clinicHistoryStatic.paciente_id : null, Validators.required)
    });
  }

  get numero_hcControl() {
    return this.clinicHistoryStaticForm?.get('numero_hc') as FormControl;
  }

  get pacienteControl() {
    return this.clinicHistoryStaticForm?.get('paciente') as FormControl;
  }

  /* onSubmit(data) {
    this.data.clinicHistoryStatic ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  } */

}
