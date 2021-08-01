import { AppointmentService } from '../../services/appointment.service';
import { APPOINTMENT_TABLE_CONFIGURATION } from '../../models/appointment-table-configuration';
import { Appointment } from '../../models/appointment.model';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';
import { UserService } from 'src/app/security-module/user/services/user.service';
import { DepartamentService } from 'src/app/structure-modules/work-station/services/departament.service';
import { PatientService } from 'src/app/patient/services/patient.service';
import { ServicesstockService } from 'src/app/stock-modules/servicesstock/services/servicesstock.service';
import { StateAppointmentService } from 'src/app/stock-modules/stock-state-appointment/services/stock-state-appointment.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss']
})
export class AppointmentPageComponent implements OnInit {
  appointment: Appointment[];
  dataCount = 0;
  configuration = APPOINTMENT_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  patient = [];
  servicesstock = [];
  user = [];
  departament = [];
  stateAppointment = [];

  rowActionButtons = [
    {
      tooltipText: 'Editar Cita',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Cita',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteAppointment(item),
    },
  ];

  constructor(
    public dialog: MatDialog,
    public appointmentService: AppointmentService,
    private departamentService: DepartamentService,
    private userService: UserService,
    private patientService: PatientService,
    private servicesstockService: ServicesstockService,
    private stateAppointmentService: StateAppointmentService,
    private toastService: ToastrService,

  ) {
    this.putUser();
    this.putDepartament();
    this.putPatient();
    this.putServicesstock();
    this.putStateAppointment();

  }

  ngOnInit(): void {
    this.getAppointment();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }


  putUser(filters = {}) {
    const sub = this.userService
      .getUsers(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[7].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }))
      .subscribe();
    this.subscriptions.push(sub);
  }

  putDepartament(filters = {}) {
    const sub = this.departamentService
      .getDepartaments(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[8].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }))
      .subscribe();
    this.subscriptions.push(sub);
  }

  putPatient(filters = {}) {
    const sub = this.patientService
      .getPatients(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.nro_identificacion }));
        }))
      .subscribe();
    this.subscriptions.push(sub);
  }

  putServicesstock(filters = {}) {
    const sub = this.servicesstockService
      .getServicesstock(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[6].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }))
      .subscribe();
    this.subscriptions.push(sub);
  }

  putStateAppointment(filters = {}) {
    const sub = this.stateAppointmentService
      .getStateAppointments(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[9].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }))
      .subscribe();
    this.subscriptions.push(sub);
  }


  getAppointment(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.appointmentService
      .getAppointment(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log(response.results);
          this.appointment = response.results.map((res) => ({
            ...res,
            id: res.id,
            numero: res.numero,
            fecha: res.fecha,
            fecha_hora_I: `${res.fecha}T${res.hora_inicio}Z`,
            fecha_hora_F: `${res.fecha}T${res.hora_fin}Z`,
            hora_inicio: res.hora_inicio,
            hora_fin: res.hora_fin,
            observaciones: res.observaciones,
            paciente: res.paciente.apellidos,
            id_paciente: res.paciente.id,
            medico: res.medico.username,
            id_medico: res.medico.id,
            servicio: res.servicio.nombre,
            id_servicio: res.servicio.id,
            departamento: res.departamento.nombre,
            id_departamento: res.departamento.id,
            estado_cita: res.estado_cita.descripcion,
            id_estado_cita: res.estado_cita.id
          }));
          this.dataCount = response.count;
          this.loading = false;
        }),

        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          this.loading = false;
          return null;
        })
      )

      .subscribe();

    this.subscriptions.push(sub);
  }


  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getAppointment(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getAppointment(filters, 'id', 'desc');
  }

  createAppointment() {
    let dialogRef: MatDialogRef<AppointmentFormComponent, any>;

    dialogRef = this.dialog.open(AppointmentFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {

        appointment: null,
        user: null,
        patient: null,
        servicesstock: null,
        departament: null,
        stateAppointment: null
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AppointmentFormComponent;

    const sub = modalComponentRef.create
      .pipe(


        switchMap((Appointment: Appointment) =>
          this.appointmentService.createAppointment(Appointment).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Cita. Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAppointment(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La Cita  fue creada correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {

    let dialogRef: MatDialogRef<AppointmentFormComponent, any>;

    dialogRef = this.dialog.open(AppointmentFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        appointment: item,
        user: item,
        patient: item,
        servicesstock: item,
        departament: item,
        stateAppointment: item
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AppointmentFormComponent;

    const sub = modalComponentRef.edit
      .pipe(

        switchMap((Appointment: Appointment) =>
          this.appointmentService.editAppointment({ ...Appointment, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Cita . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAppointment(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La Cita fue  modificadas correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteAppointment(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;

    modalComponentRef.text = `¿Está seguro que desea eliminar la Cita?`;
    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.appointmentService.deleteAppointment(item.id).pipe(
            map(() => item),
            catchError(() => {

              this.toastService.error('Hubo un error al eliminar la Cita . Por favor, inténtelo de nuevo más tarde.', 'Error');

              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAppointment(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La Cita fue eliminada correctamente.', 'Felicidades');

                modalRef.close();
              }
            }),
          ),
        ),
      )
      .subscribe();

    const sub1 = modalComponentRef.cancel.pipe(tap(() => modalRef.close())).subscribe();
    this.subscriptions.push(sub, sub1);
  }

  onChangeSort(sort: Sort) {

    this.getAppointment(this.filters, sort.active, sort.direction);
  }

}
