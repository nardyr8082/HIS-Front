import { MeasureService } from '../../services/measure.service';
import { MEASURE_TABLE_CONFIGURATION } from '../../models/measure-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Measure } from '../../models/measure.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MeasureFormComponent } from '../../components/measure-form/measure-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-measure-page',
  templateUrl: './measure-page.component.html',
  styleUrls: ['./measure-page.component.scss'],
})
export class MeasurePageComponent implements OnInit, OnDestroy {
  measure: Measure[];
  dataCount = 0;
  configuration = MEASURE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Medida',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Medida',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteMeasure(item),
    },
  ];

  constructor(private measureService: MeasureService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMeasures();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getMeasures(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.measureService
      .getMeasures(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Measure>) => {
          this.measure = response.results;
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
    this.getMeasures(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getMeasures(filters, 'id', 'desc');
  }

  createMeasure() {
    let dialogRef: MatDialogRef<MeasureFormComponent, any>;

    dialogRef = this.dialog.open(MeasureFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        measure: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as MeasureFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((measure: Measure) =>
          this.measureService.createMeasure(measure).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Medida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMeasures(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La medida fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<MeasureFormComponent, any>;

    dialogRef = this.dialog.open(MeasureFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        measure: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as MeasureFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((measure: Measure) =>
          this.measureService.editMeasure({ ...measure, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la medida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMeasures(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La medida fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteMeasure(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la medida: ${item.clave}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.measureService.deleteMeasure(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la medida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMeasures(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La medida fue eliminada correctamente.', 'Felicidades');
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
    this.getMeasures(this.filters, sort.active, sort.direction);
  }
}
