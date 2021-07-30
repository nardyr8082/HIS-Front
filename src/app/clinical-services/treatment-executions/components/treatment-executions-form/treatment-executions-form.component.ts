import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatCheckboxChange } from '@angular/material/checkbox';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TreatmentExecutions } from '../../models/treatment-executions.model';
import { TreatmentExecutionsService } from '../../services/treatment-executions.service';
import { ClinicalSectionService } from 'src/app/clinical-services/treatment-indications/services/clinical-section.service';
import { UserService } from 'src/app/security-module/user/services/user.service';
@Component({
  selector: 'app-treatment-executions-form',
  templateUrl: './treatment-executions-form.component.html',
  styleUrls: ['./treatment-executions-form.component.scss']
})
export class TreatmentExecutionsFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  treatmentExecutionsForm: FormGroup;
  treatmentExecutions: TreatmentExecutions[];
  clinicalSection: any = [];
  user: any = [];
  subscriptions: Subscription[] = [];

  constructor(
    public treatmentExecutionsService: TreatmentExecutionsService,
    private clinicalSectionService: ClinicalSectionService,
    private userService: UserService,
    public dialogRef: MatDialogRef<TreatmentExecutionsFormComponent>,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.buildForm();
    this.getClinicalSection();
    this.getUser();
  }
  ngOnDestroy() {
    this.subscriptions;
  }

  getClinicalSection() {
    const sub = this.clinicalSectionService
      .getClinicalSection({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.clinicalSection = response.results;

        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getUser() {
    const sub = this.userService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.user = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  buildForm() {

    const fecha = this.data.treatmentExecutions ? this.getFormattedDate(this.data.treatmentExecutions.fecha) : '';
    const hora = this.data.treatmentExecutions ? this.getFormattedHora(this.data.treatmentExecutions.fecha) : '';

    this.treatmentExecutionsForm = new FormGroup({
      descripcion: new FormControl(this.data.treatmentExecutions ? this.data.treatmentExecutions.descripcion : '', Validators.required),
      fecha: new FormControl(fecha, Validators.required),
      hora: new FormControl(hora, Validators.required),
      sesion_clinica: new FormControl(this.data.treatmentExecutions ? this.data.treatmentExecutions.id_sesion_clinica : '', Validators.required),
      usuario: new FormControl(this.data.treatmentExecutions ? this.data.treatmentExecutions.id_user : '', Validators.required)
    });
  }

  get descripcionControl() {
    return this.treatmentExecutionsForm?.get('descripcion') as FormControl;
  }
  get timeControl() {
    return this.treatmentExecutionsForm?.get('hora') as FormControl;
  }

  get sesion_clinicaControl() {
    return this.treatmentExecutionsForm?.get('sesion_clinica') as FormControl;
  }

  get usuarioControl() {
    return this.treatmentExecutionsForm?.get('usuario') as FormControl;
  }

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }
  getFormattedHora(apiDate: string) {
    if (apiDate.indexOf('Z') !== -1)
      apiDate = apiDate.substring(0, apiDate.length - 1);
    return new Date(apiDate);
  }

  sendData() {
    if (this.treatmentExecutionsForm.valid) {

      const treatmentExecutions = this.treatmentExecutionsForm.value;
      const dateFormat = moment(treatmentExecutions.fecha);
      treatmentExecutions.fecha = dateFormat.format('yyyy-MM-DD');


      this.data.treatmentExecutionsForm ? this.edit.emit(treatmentExecutions) : this.create.emit(treatmentExecutions);
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }


  onSubmit(data) {

    let valores = {};
    let fecha = data['fecha'].toString();
    let hora = data['hora'].toString();
    let formateadaFecha = fecha.split(' ');
    let formateadaHora = hora.split(' ');


    if (this.data.treatmentExecutionsForm === null || formateadaFecha.length > 0) {
      const midateFecha = formateadaFecha[3] + '-' + this.ChangesMonth(formateadaFecha[1]) + '-' + formateadaFecha[2];
      const mihora = formateadaHora[4];
      data['fecha'] = midateFecha;
      data['hora'] = mihora;

      valores['descripcion'] = data['descripcion'];
      valores['hora'] = data['hora'];
      valores['fecha'] = data['fecha'];
      valores['sesion_clinica'] = data['sesion_clinica'];
      valores['usuario'] = data['usuario'];
    }


    this.data.treatmentExecutions ? this.edit.emit(valores) : this.create.emit(valores);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  ChangesMonth(mes: any) {

    if (mes === 'Jan') {
      return '01';
    }
    if (mes === 'Feb') {
      return '02';
    }
    if (mes === 'Mar') {
      return '03';
    }
    if (mes === 'Apr') {
      return '04';
    }
    if (mes === 'May') {
      return '05';
    }
    if (mes === 'Jun') {
      return '06';
    }
    if (mes === 'Jul') {
      return '07';
    }
    if (mes === 'Aug') {
      return '08';
    }
    if (mes === 'Sep') {
      return '09';
    }
    if (mes === 'Oct') {
      return '10';
    }
    if (mes === 'Nov') {
      return '11';
    }
    return 12;
  }


}
