import { TreatmentIndicationsService } from '../../services/treatment-indications.service';
import { TREATMENT_INDICATIONS_TABLE_CONFIGURATION } from '../../models/treatment-indications-table-configuration';
import { TreatmentIndications } from '../../models/treatment-indications.model';
import { TreatmentIndicationsFormComponent } from '../../components/treatment-indications-form/treatment-indications-form.component';
import { ClinicalSection } from '../../models/clinical-section.model';
import { ClinicalSectionService } from '../../services/clinical-section.service';
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
  selector: 'app-treatment-indications-page',
  templateUrl: './treatment-indications-page.component.html',
  styleUrls: ['./treatment-indications-page.component.scss']
})
export class TreatmentIndicationsPageComponent implements OnInit {
  treatmentIndications: TreatmentIndications[];
  dataCount = 0;
  configuration = TREATMENT_INDICATIONS_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  clinicalSection = [];

  rowActionButtons = [
    {
      tooltipText: 'Editar Historia Clínica',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Historia Clínica',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteTreatmentIndications(item),
    },
  ];


  constructor(
    public dialog: MatDialog,
    public treatmentIndicationsService: TreatmentIndicationsService,
    private toastService: ToastrService,
    private clinicalSectionService: ClinicalSectionService
  ) {
    this.putClinicalSection();
  }

  ngOnInit(): void {
    this.getTreatmentIndications();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }


  putClinicalSection(filters = {}) {
    const sub = this.clinicalSectionService
      .getClinicalSection(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.cita['id'] }));
        }))

      .subscribe();
    this.subscriptions.push(sub);

  }

  getTreatmentIndications(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.treatmentIndicationsService
      .getTreatmentIndications(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.treatmentIndications = response.results.map((res) => ({
            ...res,
            id: res.id,
            descripcion: res.descripcion,
            fecha: `${res.fecha}T${res.hora}Z`,
            hora: res.hora,
            sesion_clinica: res.sesion_clinica.cita,
            id_sesion_clinica: res.sesion_clinica.id,

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
    this.getTreatmentIndications(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getTreatmentIndications(filters, 'id', 'desc');
  }

  createTreatmentIndications() {
    let dialogRef: MatDialogRef<TreatmentIndicationsFormComponent, any>;

    dialogRef = this.dialog.open(TreatmentIndicationsFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {

        treatmentIndications: null,

        clinicalSection: null,

      },
    });

    const modalComponentRef = dialogRef.componentInstance as TreatmentIndicationsFormComponent;

    const sub = modalComponentRef.create
      .pipe(


        switchMap((TreatmentIndications: TreatmentIndications) =>
          this.treatmentIndicationsService.createTreatmentIndications(TreatmentIndications).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear las  Indicaciones de tratamiento . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTreatmentIndications(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('Las Indicaciones de tratamiento  fueron creadas correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {

    let dialogRef: MatDialogRef<TreatmentIndicationsFormComponent, any>;

    dialogRef = this.dialog.open(TreatmentIndicationsFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        treatmentIndications: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TreatmentIndicationsFormComponent;

    const sub = modalComponentRef.edit
      .pipe(

        switchMap((TreatmentIndications: TreatmentIndications) =>
          this.treatmentIndicationsService.editTreatmentIndications({ ...TreatmentIndications, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar las indicaciones de tratamiento . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTreatmentIndications(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('Las Indicaciones de tratamiento  fueron modificadas correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteTreatmentIndications(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;

    modalComponentRef.text = `¿Está seguro que desea eliminar las Indicaciones de tratamiento?`;
    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.treatmentIndicationsService.deleteTreatmentIndications(item.id).pipe(
            map(() => item),
            catchError(() => {

              this.toastService.error('Hubo un error al eliminar las Indicaciones de tratamiento . Por favor, inténtelo de nuevo más tarde.', 'Error');

              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTreatmentIndications(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('Las Indicacines de tratamiento fueron eliminadas correctamente.', 'Felicidades');

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

    this.getTreatmentIndications(this.filters, sort.active, sort.direction);
  }

}
