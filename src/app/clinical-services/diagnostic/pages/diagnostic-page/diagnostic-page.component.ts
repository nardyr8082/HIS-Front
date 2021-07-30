import { DiagnosticService } from './../../services/diagnostic.service';
import { DIAGNOSTIC_TABLE_CONFIGURATION } from './../../models/diagnostic-table-configuration';
import { Diagnostic } from './../../models/diagnostic.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { DiagnosticFormComponent } from '../../components/diagnostic-form/diagnostic-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-diagnostic-page',
  templateUrl: './diagnostic-page.component.html',
  styleUrls: ['./diagnostic-page.component.scss'],
})
export class DiagnosticPageComponent implements OnInit, OnDestroy {
  diagnostic: Diagnostic[];
  dataCount = 0;
  configuration = DIAGNOSTIC_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Diagnóstico',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Diagnóstico',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteDiagnostic(item),
    },
  ];

  constructor(
    private diagnosticService: DiagnosticService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getClinicSession();
  }

  ngOnInit(): void {
    this.getDiagnostic();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getClinicSession(filters = {}) {
    const sub = this.diagnosticService
      .getClinicSession()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.motivo }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getDiagnostic(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.diagnosticService
      .getDiagnostic(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.diagnostic = response.results.map((resp) => {
            const sesion_clinica = resp.sesion_clinica ? resp.sesion_clinica.motivo: '';
            const sesion_clinica_id = resp.sesion_clinica ? resp.sesion_clinica.id : '';
            return { ...resp, sesion_clinica: sesion_clinica, sesion_clinica_id: sesion_clinica_id };
          });
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
    this.getDiagnostic(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getDiagnostic(filters, 'id', 'desc');
  }

  createDiagnostic() {
    let dialogRef: MatDialogRef<DiagnosticFormComponent, any>;

    dialogRef = this.dialog.open(DiagnosticFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        diagnostic: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as DiagnosticFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((diagnostic: Diagnostic) =>
          this.diagnosticService.createDiagnostic(diagnostic).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el diagnóstico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDiagnostic(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El diagnóstico fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<DiagnosticFormComponent, any>;

    dialogRef = this.dialog.open(DiagnosticFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        diagnostic: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as DiagnosticFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((diagnostic: Diagnostic) =>
          this.diagnosticService.editDiagnostic({ ...diagnostic, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el diagnóstico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDiagnostic(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El diagnóstico fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteDiagnostic(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el diagnóstico: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.diagnosticService.deleteDiagnostic(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el diagnóstico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDiagnostic(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Diagnóstico fue eliminado correctamente.', 'Felicidades');
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
    this.getDiagnostic(this.filters, sort.active, sort.direction);
  }
}
