import { ToastrService } from 'ngx-toastr';
import { InicatorTypeService } from './../../services/indicator-type.service';
import { IndicatorType } from './../../models/indicator-type.model';
import { INDICATOR_TYPE_TABLE_CONFIGURATION } from './../../models/indicator-type-table-configuration';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { IndicatorTypeFormComponent } from '../../components/indicator-type-form/indicator-type-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-indicator-type-page',
  templateUrl: './indicator-type-page.component.html',
  styleUrls: ['./indicator-type-page.component.scss'],
})
export class IndicatorTypePageComponent implements OnInit {
  indicatorTypes: IndicatorType[];
  dataCount = 0;
  configuration = INDICATOR_TYPE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Tipo de Indicador',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Tipo de Indicador',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteIndicatorType(item),
    },
  ];

  constructor(private indicatorTypeService: InicatorTypeService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getIndicatorTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getIndicatorTypes(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.indicatorTypeService
      .getIndicatorTypes(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<IndicatorType>) => {
          this.indicatorTypes = response.results;
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
    this.getIndicatorTypes(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getIndicatorTypes(filters, 'id', 'desc');
  }

  createIndicatorType() {
    let dialogRef: MatDialogRef<IndicatorTypeFormComponent, any>;

    dialogRef = this.dialog.open(IndicatorTypeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        indicatorType: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as IndicatorTypeFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((indicatorType: IndicatorType) =>
          this.indicatorTypeService.createIndicatorType(indicatorType).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el tipo de indicador. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getIndicatorTypes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El tipo de indicador fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<IndicatorTypeFormComponent, any>;

    dialogRef = this.dialog.open(IndicatorTypeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        indicatorType: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as IndicatorTypeFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((indicatorType: IndicatorType) =>
          this.indicatorTypeService.editIndicatorType({ ...indicatorType, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el tipo de indicador. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getIndicatorTypes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El tipo de indicador fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteIndicatorType(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el tipo de indicador: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.indicatorTypeService.deleteIndicatorType(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el tipo de indicador. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getIndicatorTypes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El tipo de indicador fue eliminado correctamente.', 'Felicidades');
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

  changeSort(sort: Sort) {
    this.getIndicatorTypes(this.filters, sort.active, sort.direction);
  }
}
