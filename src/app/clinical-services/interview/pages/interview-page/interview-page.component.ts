import { ClinicalSectionService } from 'src/app/clinical-services/treatment-indications/services/clinical-section.service';
import { InterviewService } from '../../services/interview.service';
import { Interview } from '../../models/interview.model';
import { InterviewFormComponent } from '../../components/interview-form/interview-form.component';
import { INTERVIEW_TABLE_CONFIGURATION } from '../../models/interview-table-configuration';
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
  selector: 'app-interview-page',
  templateUrl: './interview-page.component.html',
  styleUrls: ['./interview-page.component.scss']
})
export class InterviewPageComponent implements OnInit {
  interview: Interview[];
  dataCount = 0;
  configuration = INTERVIEW_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  clinicalSection = [];

  rowActionButtons = [
    {
      tooltipText: 'Editar Entrevista',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Entrevista',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteInterview(item),
    },
  ];

  constructor(
    public dialog: MatDialog,
    public interviewService: InterviewService,
    private clinicalSectionService: ClinicalSectionService,
    private toastService: ToastrService,
  ) {
    this.putClinicalSection();
  }
  ngOnInit(): void {
    this.getInterview();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }


  putClinicalSection(filters = {}) {
    const sub = this.clinicalSectionService
      .getClinicalSection(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {

          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.cita['id'] }));
        }))

      .subscribe();
    this.subscriptions.push(sub);

  }


  getInterview(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.interviewService
      .getInterview(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log(response.results);
          this.interview = response.results.map((res) => ({
            ...res,
            id: res.id,
            descripcion: res.descripcion,
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
    this.getInterview(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getInterview(filters, 'id', 'desc');
  }

  createInterview() {
    let dialogRef: MatDialogRef<InterviewFormComponent, any>;

    dialogRef = this.dialog.open(InterviewFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {

        interview: null,
        clinicalSection: null,

      },
    });

    const modalComponentRef = dialogRef.componentInstance as InterviewFormComponent;

    const sub = modalComponentRef.create
      .pipe(


        switchMap((Interview: Interview) =>
          this.interviewService.createInterview(Interview).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Entrevista. Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInterview(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La Entrevista fue creada correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  openEditForm(item) {

    let dialogRef: MatDialogRef<InterviewFormComponent, any>;

    dialogRef = this.dialog.open(InterviewFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        interview: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InterviewFormComponent;

    const sub = modalComponentRef.edit
      .pipe(

        switchMap((Interview: Interview) =>
          this.interviewService.editInterview({ ...Interview, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Entrevista . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInterview(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La Entrevista fue modificada correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  deleteInterview(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;

    modalComponentRef.text = `¿Está seguro que desea eliminar la Entrevista?`;
    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.interviewService.deleteInterview(item.id).pipe(
            map(() => item),
            catchError(() => {

              this.toastService.error('Hubo un error al eliminar la Entrevista . Por favor, inténtelo de nuevo más tarde.', 'Error');

              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInterview(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La Entrevista fue eliminada correctamente.', 'Felicidades');

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

    this.getInterview(this.filters, sort.active, sort.direction);
  }

}
