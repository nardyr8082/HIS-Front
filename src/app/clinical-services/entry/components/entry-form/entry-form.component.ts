import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { EntryService } from '../../services/entry.service';
import { UserService } from '../../../../security-module/user/services/user.service';
import { OfficeService } from '../../../../structure-modules/office/services/office.service';
import { PatientService } from '../../../../patient/services/patient.service';
import { AftselfresourcesService } from '../../../../resources-modules/aftselfresources/services/aftselfresources.service';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss'],
})
export class EntryFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  entryForm: FormGroup;
  paciente: any = [];
  medico_solicitante: any = [];
  sala: any = [];
  cama: any = [];
  subscriptions: Subscription[] = [];

  constructor(public resouceselfService: AftselfresourcesService, public patientService: PatientService, public officeService: OfficeService, public userService: UserService, public entryService: EntryService, public dialogRef: MatDialogRef<EntryFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getPatient();
    this.getOffice();
    this.getResourceSelf();
    this.getUser();

  }

  ngOnDestroy() {
    this.subscriptions;
  }
  getResourceSelf() {
    const sub = this.resouceselfService
      .getAftselfresources({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.cama = response.results;
          console.log(this.cama);
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
          this.medico_solicitante = response.results;
          console.log(this.medico_solicitante);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getPatient() {
    const sub = this.patientService
      .getPatients({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.paciente = response.results;
          console.log(this.paciente);
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
          this.sala = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    /*
    * "id": 6,
    "fecha_ingreso": "2021-07-17T20:16:00Z",
    "fecha_alta": "2021-07-11T17:16:00Z",
    "paciente": 2,
    "medico_solicitante": 1,
    "sala": 1,
    "cama": 1*/
    const fechai = this.data.entry ? this.getFormattedDate(this.data.entry.fecha_ingreso) : '';
    const horai = this.data.entry ? this.getFormattedHora(this.data.entry.fecha_ingreso) : '';
    const fechaa = this.data.entry ? this.getFormattedDate(this.data.entry.fecha_alta) : '';
    const horaa = this.data.entry ? this.getFormattedHora(this.data.entry.fecha_alta) : '';
    this.entryForm = new FormGroup({
      fechai: new FormControl(fechai, Validators.required),
      horai: new FormControl(horai, Validators.required),
      fechaa: new FormControl(fechaa, Validators.required),
      horaa: new FormControl(horaa, Validators.required),
      paciente: new FormControl(this.data.entry ? this.data.entry.paciente_id : '', Validators.required),
      medico_solicitante: new FormControl(this.data.entry ? this.data.entry.medico_solicitante_id : '', Validators.required),
      sala: new FormControl(this.data.entry ? this.data.entry.sala_id : '', Validators.required),
      cama: new FormControl(this.data.entry ? this.data.entry.cama_id : '', Validators.required),
    });
    console.log('mensaje form:', this.entryForm);
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
    //2021-07-09T13:48:00Z
    console.log('getFormatHora:', apiDate);
    console.log('mira la hora:', apiDate);
    const arrayDate = apiDate.split('T');
    let arrayDate1 = arrayDate[1];
    arrayDate1 = arrayDate1.substring(0, arrayDate1.length - 2);
    console.log('OJO: ', arrayDate1);
    const end = arrayDate1.split(':');
    console.log('OJO: ', end);
    return new Date(parseInt(end[0]), parseInt(end[1]) - 1, parseInt(end[2]));
  }

  get datestartControl() {
    return this.entryForm?.get('fechai') as FormControl;
  }
  get timestartControl() {
    return this.entryForm?.get('horai') as FormControl;
  }
  get timeendControl() {
    return this.entryForm?.get('horaa') as FormControl;
  }

  get dateendControl() {
    return this.entryForm?.get('fechaa') as FormControl;
  }

  get patientControl() {
    return this.entryForm?.get('paciente') as FormControl;
  }

  get medicControl() {
    return this.entryForm?.get('medico_solicitante') as FormControl;
  }
  get officeControl() {
    return this.entryForm?.get('sala') as FormControl;
  }
  get bedControl() {
    return this.entryForm?.get('cama') as FormControl;
  }

  onSubmit(data) {
    let valores = {};
    //2021-07-31T10:46:00Z
    console.log('Con esto empezamos: ', data);
    let fecha = data['fechai'].toString();
    let hora = data['horai'].toString();
    let fecha1 = data['fechaa'].toString();
    let hora1 = data['horaa'].toString();
    console.log('mira mi hora', hora);
    let formateada = fecha.split(' ');
    let formateadahora = hora.split(' ');
    let formateada1 = fecha1.split(' ');
    let formateadahora1 = hora1.split(' ');
    console.log('arregloa: ', formateadahora);
    if ( this.data.suplierreturn === null || formateada.length > 0) {
      const midate = formateada[3] + '-' + this.ChangesMonth(formateada[1]) + '-' + formateada[2];
      const midate1 = formateada1[3] + '-' + this.ChangesMonth(formateada1[1]) + '-' + formateada1[2];
      const mihora = 'T' + formateadahora[4] + 'Z';
      const mihora1 = 'T' + formateadahora1[4] + 'Z';
      valores['fecha_ingreso'] = midate + mihora;
      valores['fecha_alta'] = midate1 + mihora1;
      valores['paciente'] = data['paciente'];
      valores['medico_solicitante'] = data['medico_solicitante'];
      valores['sala'] = data['sala'];
      valores['cama'] = data['cama'];
    }
    console.log('valores: ', valores);
    this.data.entry ? this.edit.emit(valores) : this.create.emit(valores);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
