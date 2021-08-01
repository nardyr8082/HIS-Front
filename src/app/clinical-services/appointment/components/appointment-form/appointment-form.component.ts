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
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { UserService } from 'src/app/security-module/user/services/user.service';
import { DepartamentService } from 'src/app/structure-modules/work-station/services/departament.service';
import { PatientService } from 'src/app/patient/services/patient.service';
import { ServicesstockService } from 'src/app/stock-modules/servicesstock/services/servicesstock.service';
import { StateAppointmentService } from 'src/app/stock-modules/stock-state-appointment/services/stock-state-appointment.service';


@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  appointmentForm: FormGroup;
  subscriptions: Subscription[] = [];

  appointment: Appointment[];
  paciente: any = [];
  servicesstock: any = [];
  user: any = [];
  departament: any = [];
  stateAppointment: any = [];

  constructor(
    public appointmentService: AppointmentService,
    private departamentService: DepartamentService,
    private userService: UserService,
    private patientService: PatientService,
    private servicesstockService: ServicesstockService,
    private stateAppointmentService: StateAppointmentService,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getUser();
    this.getDepartament();
    this.getPatient();
    this.getServicesstock();
    this.getStateAppointment();
  }

  ngOnDestroy() {
    this.subscriptions;
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

  getDepartament() {
    const sub = this.departamentService
      .getDepartaments({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.departament = response.results;
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
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getServicesstock() {
    const sub = this.servicesstockService
      .getServicesstock({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.servicesstock = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getStateAppointment() {
    const sub = this.stateAppointmentService
      .getStateAppointments({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.stateAppointment = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    console.log(this.data);
    const fecha = this.data.appointment ? this.getFormattedDate(this.data.appointment.fecha) : '';
    const hora_inicio = this.data.appointment ? this.getFormattedHora(this.data.appointment.fecha_hora_I) : '';
    const hora_fin = this.data.appointment ? this.getFormattedHora(this.data.appointment.fecha_hora_F) : '';
    this.appointmentForm = new FormGroup({
      numero: new FormControl(this.data.appointment ? this.data.appointment.numero : '', Validators.required),
      fecha: new FormControl(fecha, Validators.required),
      hora_inicio: new FormControl(hora_inicio, Validators.required),
      hora_fin: new FormControl(hora_fin, Validators.required),
      observaciones: new FormControl(this.data.appointment ? this.data.appointment.observaciones : '', Validators.required),
      paciente: new FormControl(this.data.appointment ? this.data.appointment.id_paciente : '', Validators.required),
      medico: new FormControl(this.data.appointment ? this.data.appointment.id_medico : '', Validators.required),
      servicio: new FormControl(this.data.appointment ? this.data.appointment.id_servicio : '', Validators.required),
      departamento: new FormControl(this.data.appointment ? this.data.appointment.id_departamento : '', Validators.required),
      estado_cita: new FormControl(this.data.appointment ? this.data.appointment.id_estado_cita : '', Validators.required)
    });
    console.log(this.appointmentForm);
  }

  get numeroControl() {
    return this.appointmentForm?.get('numero') as FormControl;
  }

  get hora_inicioControl() {
    return this.appointmentForm?.get('hora_inicio') as FormControl;
  }

  get hora_finControl() {
    return this.appointmentForm?.get('hora_fin') as FormControl;
  }

  get observacionesControl() {
    return this.appointmentForm?.get('observaciones') as FormControl;
  }

  get pacienteControl() {
    return this.appointmentForm?.get('paciente') as FormControl;
  }

  get medicoControl() {
    return this.appointmentForm?.get('medico') as FormControl;
  }

  get servicioControl() {
    return this.appointmentForm?.get('servicio') as FormControl;
  }

  get departamentoControl() {
    return this.appointmentForm?.get('departamento') as FormControl;
  }

  get estado_citaControl() {
    return this.appointmentForm?.get('estado_cita') as FormControl;
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
    if (this.appointmentForm.valid) {

      const appointment = this.appointmentForm.value;
      const dateFormat = moment(appointment.fecha);
      appointment.fecha = dateFormat.format('yyyy-MM-DD');


      this.data.appointmentForm ? this.edit.emit(appointment) : this.create.emit(appointment);
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }


  onSubmit(data) {

    let valores = {};
    let fecha = data['fecha'].toString();
    let hora_inicio = data['hora_inicio'].toString();
    let hora_fin = data['hora_fin'].toString();
    let formateadaFecha = fecha.split(' ');
    let formateadaHora = hora_inicio.split(' ');
    let formateadaHoraF = hora_fin.split(' ');


    if (this.data.appointmentForm === null || formateadaFecha.length > 0) {
      const midateFecha = formateadaFecha[3] + '-' + this.ChangesMonth(formateadaFecha[1]) + '-' + formateadaFecha[2];
      const mihora = formateadaHora[4];
      const mihoraF = formateadaHoraF[4];
      data['fecha'] = midateFecha;
      data['hora_inicio'] = mihora;
      data['hora_fin'] = mihoraF;

      valores['numero'] = data['numero'];
      valores['hora_inicio'] = data['hora_inicio'];
      valores['hora_fin'] = data['hora_fin'];
      valores['fecha'] = data['fecha'];
      valores['observaciones'] = data['observaciones'];
      valores['servicio'] = data['servicio'];
      valores['departamento'] = data['departamento'];
      valores['estado_cita'] = data['estado_cita'];
      valores['medico'] = data['medico'];
      valores['paciente'] = data['paciente'];
    }


    this.data.appointment ? this.edit.emit(valores) : this.create.emit(valores);
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
