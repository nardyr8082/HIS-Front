import { IndicatorService } from './../../../indicator/services/indicator.service';
import { VariableIndicatorService } from './../../services/variable-indicator.service';
import { VARIABLE_INDICATOR_TABLE_CONFIGURATION } from './../../models/variable-indicator-table-configuration';
import { VariableIndicator } from './../../models/variable-indicator.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { VariableIndicatorFormComponent } from '../../components/variable-indicator-form/variable-indicator-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-variable-indicator-page',
  templateUrl: './variable-indicator-page.component.html',
  styleUrls: ['./variable-indicator-page.component.scss'],
})
export class VariableIndicatorPageComponent implements OnInit, OnDestroy {
  variableIndicator: VariableIndicator[];
  dataCount = 0;
  configuration = VARIABLE_INDICATOR_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Indicador Variable',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Indicador Variable',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteVariableIndicator(item),
    },
  ];

  constructor(
    private variableIndicatorService: VariableIndicatorService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private indicatorService: IndicatorService,
  ) {
    this.getIndicator();
  }

  ngOnInit(): void {
    this.getVariableIndicator();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getIndicator(filters = {}) {
    const sub = this.indicatorService
      .getIndicator(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getVariableIndicator(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.variableIndicatorService
      .getVariableIndicator(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.variableIndicator = response.results.map((res) => ({
            ...res,
            indicador_nombre: res.indicador.nombre,
            indicador_id:res.indicador.id
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
    this.getVariableIndicator(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getVariableIndicator(filters, 'id', 'desc');
  }

  createVariableIndicator() {
    let dialogRef: MatDialogRef<VariableIndicatorFormComponent, any>;

    dialogRef = this.dialog.open(VariableIndicatorFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        variableIndicator: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as VariableIndicatorFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((variableIndicator: VariableIndicator) =>
          this.variableIndicatorService.createVariableIndicator(variableIndicator).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Indicador Variable. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getVariableIndicator(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Indicador Variable fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<VariableIndicatorFormComponent, any>;

    dialogRef = this.dialog.open(VariableIndicatorFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        variableIndicator: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as VariableIndicatorFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((variableIndicator: VariableIndicator) =>
          this.variableIndicatorService.editVariableIndicator({ ...variableIndicator, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el indicador variable. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getVariableIndicator(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Indicador Variable fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteVariableIndicator(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Indicador Variable: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.variableIndicatorService.deleteVariableIndicator(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el indicador Variable. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getVariableIndicator(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Indicador Variable fue eliminado correctamente.', 'Felicidades');
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
    this.getVariableIndicator(this.filters, sort.active, sort.direction);
  }
}
