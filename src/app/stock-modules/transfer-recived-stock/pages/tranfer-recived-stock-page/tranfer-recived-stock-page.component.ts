import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { TranferRecivedStockFormComponent } from './../../components/tranfer-recived-stock-form/tranfer-recived-stock-form.component';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { WarehouseMovementDetailService } from './../../../warehouse-movement-detail/services/warehouse-movement-detail.service';
import { TransferRecivedService } from './../../services/transfer-recived-stock.service';
import { TransferRecivedStock } from './../../models/transfer-recived-stock.model';
import { TRANSFER_RECIVED_TABLE_CONFIGURATION } from './../../models/transfer-recived-stock-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-tranfer-recived-stock-page',
  templateUrl: './tranfer-recived-stock-page.component.html',
  styleUrls: ['./tranfer-recived-stock-page.component.scss'],
})
export class TranferRecivedStockPageComponent implements OnInit, OnDestroy {
  recivedTransfers: TransferRecivedStock[];
  dataCount = 0;
  configuration = TRANSFER_RECIVED_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Transferencia Recibida',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Transferencia Recibida',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteTransferRecivedStock(item),
    },
  ];

  constructor(
    private transferRecivedStockService: TransferRecivedService,
    private moveService: WarehouseMovementDetailService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.associteMoveWithFilters();
  }

  ngOnInit(): void {
    this.getTransferRecivedStock();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  associteMoveWithFilters() {
    const sub = this.moveService
      .getMovement()
      .pipe(
        map((response) => {
          const items = response.results.map((move) => ({ id: move.id, name: move.nro_control }));
          this.configuration.tableFilters[0].items = items;
          this.configuration.tableFilters[1].items = items;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getTransferRecivedStock(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.transferRecivedStockService
      .getTransferRecivedStock(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<TransferRecivedStock>) => {
          this.recivedTransfers = response.results.map((response) => {
            const movimiento_string = response.movimiento.nro_control;
            const movimiento_origen_string = response.movimiento_origen.nro_control;
            return { ...response, movimiento_string, movimiento_origen_string };
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
    this.getTransferRecivedStock(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getTransferRecivedStock(filters, 'id', 'desc');
  }

  createRecivedTransfer() {
    let dialogRef: MatDialogRef<TranferRecivedStockFormComponent, any>;

    dialogRef = this.dialog.open(TranferRecivedStockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        tranferRecived: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TranferRecivedStockFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((recivedTransfers: TransferRecivedStock) =>
          this.transferRecivedStockService.createTransferRecivedStock(recivedTransfers).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Transferencia Recibida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTransferRecivedStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Transferencia Recibida fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<TranferRecivedStockFormComponent, any>;

    dialogRef = this.dialog.open(TranferRecivedStockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        tranferRecived: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TranferRecivedStockFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((recivedTransfers: TransferRecivedStock) =>
          this.transferRecivedStockService.editTransferRecivedStock({ ...recivedTransfers, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Transferencia Recibida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTransferRecivedStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Transferencia Recibida fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteTransferRecivedStock(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Transferencia Recibida seleccionanda?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.transferRecivedStockService.deleteTransferRecivedStock(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Transferencia Recibida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTransferRecivedStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Transferencia Recibida fue eliminado correctamente.', 'Felicidades');
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
    this.getTransferRecivedStock(this.filters, sort.active, sort.direction);
  }
}
