import { TreatmentExecutionsService } from '../../services/treatment-executions.service';
import { TREATMENT_EXECUTIONS_TABLE_CONFIGURATION } from '../../models/treatment-executions-table-configuration';
import { TreatmentExecutions } from '../../models/treatment-executions.model';
import { TreatmentExecutionsFormComponent } from '../../components/treatment-executions-form/treatment-executions-form.component';
import { ClinicalSectionService } from 'src/app/clinical-services/treatment-indications/services/clinical-section.service';
import { UserService } from 'src/app/security-module/user/services/user.service';
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
  selector: 'app-treatment-executions-page',
  templateUrl: './treatment-executions-page.component.html',
  styleUrls: ['./treatment-executions-page.component.scss']
})
export class TreatmentExecutionsPageComponent implements OnInit {
  treatmentExecutions: TreatmentExecutions[];
  dataCount = 0;
  configuration = TREATMENT_EXECUTIONS_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  clinicalSection = [];
  user = [];
  rowActionButtons = [
    {
      tooltipText: 'Editar Ejecuciones de Tratamiento',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Ejecuciones de Tratamiento',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteTreatmentExecutions(item),
    },
  ];


  constructor(
    public dialog: MatDialog,
    public treatmentExecutionsService: TreatmentExecutionsService,
    private clinicalSectionService: ClinicalSectionService,
    private userService: UserService,
    private toastService: ToastrService,
  ) {
    this.putClinicalSection();
    this.putUser();
  }

  ngOnInit(): void {
    this.getTreatmentExecutions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }


  putClinicalSection(filters = {}) {
    const sub = this.clinicalSectionService
      .getClinicalSection(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {

          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.cita['id'] }));
        }))

      .subscribe();
    this.subscriptions.push(sub);

  }

  putUser(filters = {}) {
    const sub = this.userService
      .getUsers(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }))
      .subscribe();
    this.subscriptions.push(sub);
  }

  getTreatmentExecutions(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.treatmentExecutionsService
      .getTreatmentExecutions(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log(response.results);
          this.treatmentExecutions = response.results.map((res) => ({
            ...res,
            id: res.id,
            descripcion: res.descripcion,
            fecha: `${res.fecha}T${res.hora}Z`,
            hora: res.hora,
            sesion_clinica: res.sesion_clinica.cita,
            id_sesion_clinica: res.sesion_clinica.id,
            usuario: res.usuario.username,
            id_user: res.usuario.id
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
    this.getTreatmentExecutions(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getTreatmentExecutions(filters, 'id', 'desc');
  }

  createTreatmentExecutions() {
    let dialogRef: MatDialogRef<TreatmentExecutionsFormComponent, any>;

    dialogRef = this.dialog.open(TreatmentExecutionsFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {

        treatmentExecutions: null,

        clinicalSection: null,
        user: null
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TreatmentExecutionsFormComponent;

    const sub = modalComponentRef.create
      .pipe(


        switchMap((TreatmentExecutions: TreatmentExecutions) =>
          this.treatmentExecutionsService.createTreatmentExecutions(TreatmentExecutions).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear las  Ejecuciones de tratamiento . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTreatmentExecutions(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('Las Ejecuciones de tratamiento  fueron creadas correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {

    let dialogRef: MatDialogRef<TreatmentExecutionsFormComponent, any>;

    dialogRef = this.dialog.open(TreatmentExecutionsFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        treatmentExecutions: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TreatmentExecutionsFormComponent;

    const sub = modalComponentRef.edit
      .pipe(

        switchMap((TreatmentExecutions: TreatmentExecutions) =>
          this.treatmentExecutionsService.editTreatmentExecutions({ ...TreatmentExecutions, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar las Ejecuciones de tratamiento . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTreatmentExecutions(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('Las Ejecuciones de tratamiento  fueron modificadas correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteTreatmentExecutions(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;

    modalComponentRef.text = `¿Está seguro que desea eliminar las Ejecuciones de tratamiento?`;
    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.treatmentExecutionsService.deleteTreatmentExecutions(item.id).pipe(
            map(() => item),
            catchError(() => {

              this.toastService.error('Hubo un error al eliminar las Ejecuciones de tratamiento . Por favor, inténtelo de nuevo más tarde.', 'Error');

              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTreatmentExecutions(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('Las Ejecuciones de tratamiento fueron eliminadas correctamente.', 'Felicidades');

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

    this.getTreatmentExecutions(this.filters, sort.active, sort.direction);
  }




}
