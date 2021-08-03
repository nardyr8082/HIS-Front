import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { PinpacienteFormComponent } from '../../components/pinpaciente-form/pinpaciente-form.component';
import { Pinpaciente_TABLE_CONFIGURATION } from '../../models/pinpaciente-table-configuration';
import { Patient } from '../../../../patient/models/patient.model';
import { PatientService } from '../../../../patient/services/patient.service';


@Component({
  selector: 'app-pinpaciente-page',
  templateUrl: './pinpaciente-page.component.html',
  styleUrls: ['./pinpaciente-page.component.scss'],
})
export class PinpacientePageComponent implements OnInit, OnDestroy {
  pinpaciente: Patient[];
  dataCount = 0;
  configuration = Pinpaciente_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Pin Paciente',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Pin Paciente',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deletePatient(item),
    },
  ];

  constructor(
    private pinpacienteService: PatientService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getPatient();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }




  getPatient(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.pinpacienteService
      .getPatients(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log('mi response: ', response.results);
          this.pinpaciente = response.results.map((res) => ({
            ...res,
          }));
          console.log('getPatient Pages: ', this.pinpaciente);
          this.pinpaciente = this.pinpaciente.filter( (dif) => (dif.pin !== '0000' ) );
          this.dataCount = this.pinpaciente.length;
          this.loading = false;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          this.loading = false;
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getPatient(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getPatient(filters, 'id', 'desc');
  }

  createPatient() {
    let dialogRef: MatDialogRef<PinpacienteFormComponent, any>;

    dialogRef = this.dialog.open(PinpacienteFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        pinpaciente: null,
      },
      disableClose: true,
    });

    const modalComponentRef = dialogRef.componentInstance as PinpacienteFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((pinpaciente: Patient) =>
          this.pinpacienteService.createPatient(pinpaciente).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Pin Paciente. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPatient(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Pin Paciente fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<PinpacienteFormComponent, any>;

    dialogRef = this.dialog.open(PinpacienteFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        pinpaciente: item,
      },
      disableClose: true,
    });
    const modalComponentRef = dialogRef.componentInstance as PinpacienteFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((pinpaciente: Patient) =>
          this.pinpacienteService.editPatient({ ...pinpaciente, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Pin Paciente. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPatient(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Pin Paciente fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deletePatient(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Pin Paciente?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.pinpacienteService.deletePatient(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Pin Paciente. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPatient(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Pin Paciente fue eliminado correctamente.', 'Felicidades');
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
    this.getPatient(this.filters, sort.active, sort.direction);
  }
}
