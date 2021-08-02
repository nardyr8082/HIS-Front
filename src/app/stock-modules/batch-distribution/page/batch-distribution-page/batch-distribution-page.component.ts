import { WarehouseLotService } from 'src/app/stock-modules/warehouse-lot/services/warehouse-lot.service';
import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { BatchDistributionFormComponent } from './../../components/batch-distribution-form/batch-distribution-form.component';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { BatchDistributionService } from './../../services/batch-distribution.service';
import { BATCH_DISTRIBUTION_TABLE_CONFIGURATION } from './../../models/batch-distribution-table-configuration';
import { BatchDistribution } from './../../models/batch-distribution.model';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-batch-distribution-page',
  templateUrl: './batch-distribution-page.component.html',
  styleUrls: ['./batch-distribution-page.component.scss'],
})
export class BatchDistributionPageComponent implements OnInit, OnDestroy, OnChanges {
  batchDistribution: BatchDistribution[];
  @Input() moveDetail;
  dataCount = 0;
  configuration = BATCH_DISTRIBUTION_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  @Input() filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Distribución de Lote',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Distribución de Lote',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteBatchDistribution(item),
    },
  ];

  constructor(
    private batchDistributionService: BatchDistributionService,
    private loteService: WarehouseLotService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.associteLoteWithFilters();
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.getBatchDistribution();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  associteLoteWithFilters() {
    const sub = this.loteService
      .getWarehouseLot({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          const items = response.results.map((lote) => ({ id: lote.id, name: lote.codigo }));
          this.configuration.tableFilters[1].items = items;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getBatchDistribution(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.batchDistributionService
      .getBatchDistribution(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<BatchDistribution>) => {
          this.batchDistribution = response.results.map((response) => {
            console.log('response', response);
            const lote_string = response.lote.codigo;
            const detalle_movimiento_string = response.detalle_movimiento.movimiento;
            return { ...response, lote_string, detalle_movimiento_string };
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
    this.getBatchDistribution(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = { ...this.filters, ...filters };
    this.getBatchDistribution(filters, 'id', 'desc');
  }

  createBatchDistribution() {
    let dialogRef: MatDialogRef<BatchDistributionFormComponent, any>;

    dialogRef = this.dialog.open(BatchDistributionFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        batchDistribution: null,
        moveDetail: this.moveDetail,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as BatchDistributionFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((batchDistribution: BatchDistribution) =>
          this.batchDistributionService.createBatchDistribution(batchDistribution).pipe(
            catchError((error) => {
              this.toastService.error(
                error?.msg ? error?.msg : 'Hubo un error al crear el Distribución de Lote. Por favor, inténtelo de nuevo más tarde.',
                'Error',
              );
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBatchDistribution(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Distribución de Lote fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<BatchDistributionFormComponent, any>;

    dialogRef = this.dialog.open(BatchDistributionFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        batchDistribution: item,
        moveDetail: this.moveDetail,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as BatchDistributionFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((batchDistribution: BatchDistribution) =>
          this.batchDistributionService.editBatchDistribution({ ...batchDistribution, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Distribución de Lote. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBatchDistribution(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Distribución de Lote fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteBatchDistribution(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Distribución de Lote seleccionanda?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.batchDistributionService.deleteBatchDistribution(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Distribución de Lote. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBatchDistribution(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Distribución de Lote fue eliminado correctamente.', 'Felicidades');
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
    this.getBatchDistribution(this.filters, sort.active, sort.direction);
  }
}
