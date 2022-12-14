import { IndicatorService } from './../../../indicator/services/indicator.service';
import { SubcategoryService } from '../../../classifiers/subcategory/services/subcategory.service';
import { Subcategory } from '../../../classifiers/subcategory/models/subcategory.model';
import { INDICATOR_TABLE_CONFIGURATION } from './../../models/indicator-table-configuration';
import { Indicator } from './../../models/indicator.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import {IndicatorFormComponent } from '../../components/indicator-form/indicator-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { IndicatorType } from '../../../indicator-type/models/indicator-type.model';
import { IndicatorTypeService } from '../../../indicator-type/services/indicator-type.service';
import { Frequency } from '../../../classifiers/frequency/models/frequency.model';
import { FrequencyService } from '../../../classifiers/frequency/services/frequency.service';

@Component({
  selector: 'app-indicator-page',
  templateUrl: './indicator-page.component.html',
  styleUrls: ['./indicator-page.component.scss'],
})
export class IndicatorPageComponent implements OnInit, OnDestroy {
  indicator: Indicator[];
  dataCount = 0;
  configuration = INDICATOR_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Indicador',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Indicador',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteIndicator(item),
    },
  ];

  constructor(
    private indicatorService: IndicatorService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private subcategoryService:SubcategoryService,
    private indicatorTypeService: IndicatorTypeService,
    private frequencyService: FrequencyService,
  ) {
  }

  ngOnInit(): void {
    this.getIndicator();
    this.getIndicatorTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getIndicatorTypes() {
    const sub = this.indicatorService
      .getIndicatorTypes()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getIndicator(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.indicatorService
      .getIndicator(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.indicator = response.results.map((res) => ({
            ...res,
            subcategoria_descripcion: res.subcategoria.descripcion,
            subcategoria_id:res.subcategoria.id,
            tipo_indicador_descripcion: res.tipo_indicador.descripcion,
            tipo_indicador_id: res.tipo_indicador.id,
            frecuencia_descripcion: res.frecuencia.descripcion,
            frecuencia_id: res.frecuencia.id,
          }));
          this.dataCount = response.count;
          this.loading = false;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
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
    this.getIndicator(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getIndicator(filters, 'id', 'desc');
  }

  createIndicator() {
    let dialogRef: MatDialogRef<IndicatorFormComponent, any>;

    dialogRef = this.dialog.open(IndicatorFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        indicator: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as IndicatorFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((Indicator: Indicator) =>
          this.indicatorService.createIndicator(Indicator).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Indicador . Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getIndicator(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Indicador  fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<IndicatorFormComponent, any>;

    dialogRef = this.dialog.open(IndicatorFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        indicator: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as IndicatorFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((Indicator: Indicator) =>
          this.indicatorService.editIndicator({ ...Indicator, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el indicador . Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getIndicator(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Indicador  fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteIndicator(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `??Est?? seguro que desea eliminar el Indicador : ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.indicatorService.deleteIndicator(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el indicador . Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getIndicator(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Indicador  fue eliminado correctamente.', 'Felicidades');
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
    this.getIndicator(this.filters, sort.active, sort.direction);
  }
}
