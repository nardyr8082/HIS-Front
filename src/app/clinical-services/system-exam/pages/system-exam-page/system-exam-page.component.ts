import { SystemExamService } from './../../services/system-exam.service';
import { SYSTEM_EXAM_TABLE_CONFIGURATION } from './../../models/system-exam-table-configuration';
import { SystemExam } from './../../models/system-exam.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { SystemExamFormComponent } from '../../components/system-exam-form/system-exam-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { PhysicalexamService } from '../../../physicalexam/services/physicalexam.service'

@Component({
  selector: 'app-system-exam-page',
  templateUrl: './system-exam-page.component.html',
  styleUrls: ['./system-exam-page.component.scss'],
})
export class SystemExamPageComponent implements OnInit, OnDestroy {
  systemExam: SystemExam[];
  dataCount = 0;
  configuration = SYSTEM_EXAM_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Examen Sistema',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Examen Sistema',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteSystemExam(item),
    },
  ];

  constructor(
    private systemExamService: SystemExamService,
    private toastService: ToastrService,
    private fisicExamService: PhysicalexamService,
    public dialog: MatDialog,
  ) {
    this.getFisicExam();
    this.getSystem();
  
  }

  ngOnInit(): void {
    this.getSystemExam();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getFisicExam(filters = {}) {
    const sub = this.fisicExamService
      .getPhysicalexam({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.impresion_general }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getSystem(filters = {}) {
    const sub = this.systemExamService
      .getSystem()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getSystemExam(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.systemExamService
      .getSystemExam(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.systemExam = response.results.map((res) => ({
            ...res,
            examen_fisico_string: res.examen_fisico.impresion_general,
            examen_fisico_id:res.examen_fisico.id,
            sistema_id: res.sistema.id,
            sistema_string: res.sistema.descripcion,
          }));
          this.dataCount = response.count;
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
    this.getSystemExam(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getSystemExam(filters, 'id', 'desc');
  }

  createSystemExam() {
    let dialogRef: MatDialogRef<SystemExamFormComponent, any>;

    dialogRef = this.dialog.open(SystemExamFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        systemExam: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SystemExamFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((systemExam: SystemExam) =>
          this.systemExamService.createSystemExam(systemExam).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Examen Sistema. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSystemExam(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El examen sistema fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<SystemExamFormComponent, any>;

    dialogRef = this.dialog.open(SystemExamFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        systemExam: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as SystemExamFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((systemExam: SystemExam) =>
          this.systemExamService.editSystemExam({ ...systemExam, id: item.examen_fisico.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el examen sistema. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSystemExam(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El examen sistema fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteSystemExam(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el examen sistema seleccionado?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.systemExamService.deleteSystemExam(item.examen_fisico.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el examen sistema. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSystemExam(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El examen sistema fue eliminado correctamente.', 'Felicidades');
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
    this.getSystemExam(this.filters, sort.active, sort.direction);
  }
}
