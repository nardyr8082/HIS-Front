import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ClinicsessionService } from '../../services/clinicsession.service';
import { UserService } from '../../../../security-module/user/services/user.service';
import { DiseaseService } from '../../../disease/services/disease.service';
import { ClinicHistoryStaticService } from '../../../clinic-history-static/services/clinic-history-static.service';
import { OfficeService } from '../../../../structure-modules/office/services/office.service';
import { AppointmentService } from '../../../appointment/services/appointment.service';


@Component({
  selector: 'app-clinicsession-form',
  templateUrl: './clinicsession-form.component.html',
  styleUrls: ['./clinicsession-form.component.scss'],
})
export class ClinicsessionFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  clinicsessionForm: FormGroup;
  medico_realiza: any = [];
  medico_solicita: any = [];
  enfermedades: any = [];
  hc: any = [];
  departamento: any = [];
  cita: any = [];
  subscriptions: Subscription[] = [];

  constructor(public appoinmentSerice: AppointmentService, public officeService: OfficeService, public hcService: ClinicHistoryStaticService, public diseaseService: DiseaseService, public userService: UserService, public clinicsessionService: ClinicsessionService, public dialogRef: MatDialogRef<ClinicsessionFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getMedicRealiza();
    this.getMedicSolicita();
    this.getDisease();
    this.getHc();
    this.getOffice();
    this.getCita();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getMedicRealiza() {
    const sub = this.userService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.medico_realiza = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getMedicSolicita() {
    const sub = this.userService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.medico_solicita = response.results;
          console.log('medico solicita', this.medico_solicita);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getCita() {
    const sub = this.appoinmentSerice
      .getAppointment({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.cita = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getDisease() {
    const sub = this.diseaseService
      .getDiseases({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.enfermedades = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getOffice() {
    const sub = this.officeService
      .getOffice({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.departamento = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getHc() {
    const sub = this.hcService
      .getClinicHistoryStatic({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.hc = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const enfermedadesIds = this.data.clinicsession ? this.data.clinicsession.enfermedades.map((r) => r.id) : [];
    const fechai = this.data.clinicsession ? this.getFormattedDate(this.data.clinicsession.fecha_solicitud) : '';
    const horai = this.data.clinicsession ? this.getFormattedHora(this.data.clinicsession.fecha_solicitud) : '';
    const fechaf = this.data.clinicsession ? this.getFormattedDate(this.data.clinicsession.fecha_realizacion) : '';
    const horaf = this.data.clinicsession ? this.getFormattedHora(this.data.clinicsession.fecha_realizacion) : '';
    this.clinicsessionForm = new FormGroup({

      motivo: new FormControl(this.data.clinicsession ? this.data.clinicsession.motivo : '', Validators.required),
      fecha_inicioT: new FormControl(fechai, Validators.required),
      horaiT: new FormControl(horai, Validators.required),
      horafT: new FormControl(horaf, Validators.required),
      fecha_finT: new FormControl(fechaf, Validators.required),
      hc: new FormControl(this.data.clinicsession ? this.data.clinicsession.hc.id : '', Validators.required),
      medico_realiza: new FormControl(this.data.clinicsession ? this.data.clinicsession.medico_realiza.id : '', Validators.required),
      medico_solicita: new FormControl(this.data.clinicsession ? this.data.clinicsession.medico_solicita.id : '', Validators.required),
      cita: new FormControl(this.data.clinicsession ? this.data.clinicsession.cita.id : '', Validators.required),
      departamento: new FormControl(this.data.clinicsession ? this.data.clinicsession.departamento.id : '', Validators.required),
      enfermedades: new FormControl(enfermedadesIds, Validators.required),
    });
    console.log('mensaje form:', this.clinicsessionForm);
  }
  ChangesMonth(mes: any) {
    console.log('El mes es: ', mes);
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
  getFormattedDate(apiDate: string) {
    console.log('getFormatDAte:', apiDate);
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }
  getFormattedHora(apiDate: string) {
    if (apiDate.indexOf('Z') !== -1 )
      apiDate = apiDate.substring(0, apiDate.length - 1);
    return new Date(apiDate);
  }
  get motivoControl() {
    return this.clinicsessionForm?.get('motivo') as FormControl;
  }
  get datestartControl() {
    return this.clinicsessionForm?.get('fecha_inicioT') as FormControl;
  }
  get timestartControl() {
    return this.clinicsessionForm?.get('horaiT') as FormControl;
  }
  get timeendControl() {
    return this.clinicsessionForm?.get('horafT') as FormControl;
  }

  get dateendControl() {
    return this.clinicsessionForm?.get('fecha_finT') as FormControl;
  }

  get hcControl() {
    return this.clinicsessionForm?.get('hc') as FormControl;
  }

  get medicReaControl() {
    return this.clinicsessionForm?.get('medico_realiza') as FormControl;
  }
  get medicSolControl() {
    return this.clinicsessionForm?.get('medico_solicita') as FormControl;
  }
  get citaControl() {
    return this.clinicsessionForm?.get('cita') as FormControl;
  }

  get departamentoControl() {
    return this.clinicsessionForm?.get('departamento') as FormControl;
  }
  get enfermedadesControl() {
    return this.clinicsessionForm?.get('enfermedades') as FormControl;
  }

  onSubmit(data) {
    let valores = {};
    //2021-07-31T10:46:00Z
    let fecha = data['fecha_inicioT'].toString();
    let hora = data['horaiT'].toString();
    let fecha1 = data['fecha_finT'].toString();
    let hora1 = data['horafT'].toString();
    console.log('mira mi hora', hora);
    let formateada = fecha.split(' ');
    let formateadahora = hora.split(' ');
    let formateada1 = fecha1.split(' ');
    let formateadahora1 = hora1.split(' ');
    console.log('arregloa: ', formateadahora);
    if ( this.data.clinicsession === null || formateada.length > 0) {
      const midate = formateada[3] + '-' + this.ChangesMonth(formateada[1]) + '-' + formateada[2];
      const midate1 = formateada1[3] + '-' + this.ChangesMonth(formateada1[1]) + '-' + formateada1[2];
      const mihora = 'T' + formateadahora[4];
      const mihora1 = 'T' + formateadahora1[4];
      valores['fecha_solicitud'] = midate + mihora;
      valores['fecha_realizacion'] = midate1 + mihora1;
      valores['motivo'] = data['motivo'];
      valores['hc'] = data['hc'];
      valores['medico_realiza'] = data['medico_realiza'];
      valores['medico_solicita'] = data['medico_solicita'];
      valores['cita'] = data['cita'];
      valores['departamento'] = data['departamento'];
      valores['enfermedades'] = data['enfermedades'];
    }
    console.log('valores: ', valores);
    this.data.clinicsession ? this.edit.emit(valores) : this.create.emit(valores);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
