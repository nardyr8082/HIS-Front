import { WarehouseReceivedTransferService } from './../../../warehouse-received-transfer/services/warehouse-received-transfer.service';
import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ApiResponse, DEFAULT_PAGE_SIZE } from './../../../../core/models/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TransferEmitedStock } from '../../models/transfer-emited-stock.model';
import { TRANSFER_EMITED_TABLE_CONFIGURATION } from '../../models/transfer-emited-stock-table-configuration';
import { TransferEmitedService } from '../../services/transfer-emited-stock.service';
import { TranferEmitedStockFormComponent } from '../../components/transfer-emited-stock-form/transfer-emited-stock-form.component';

@Component({
  selector: 'app-tranfer-emited-stock-page',
  templateUrl: './transfer-emited-stock-page.component.html',
  styleUrls: ['./transfer-emited-stock-page.component.scss'],
})
export class TranferEmitedStockPageComponent implements OnInit, OnDestroy {
  emitedTransfers: TransferEmitedStock[];
  dataCount = 0;
  configuration = TRANSFER_EMITED_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Transferencia Emitida',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Transferencia Emitida',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteTransferEmitedStock(item),
    },
  ];

  constructor(
    private transferEmitedStockService: TransferEmitedService,
    private recivedTransferService: WarehouseReceivedTransferService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getTransferEmitedStock();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getTransferEmitedStock(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.transferEmitedStockService
      .getTransferEmitedStock(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<TransferEmitedStock>) => {
          this.emitedTransfers = response.results;
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
    this.getTransferEmitedStock(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getTransferEmitedStock(filters, 'id', 'desc');
  }

  createEmitedTransfer() {
    let dialogRef: MatDialogRef<TranferEmitedStockFormComponent, any>;

    dialogRef = this.dialog.open(TranferEmitedStockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '1000px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        transferEmited: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TranferEmitedStockFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((emitedTransfers: TransferEmitedStock) =>
          this.transferEmitedStockService.createTransferEmitedStock(emitedTransfers).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Transferencia Emitida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((res) => {
              const recivedTransfer = res;
              recivedTransfer.almacen = res.almacen_destino;
              recivedTransfer.transferencia_origen = res.id;
              this.recivedTransferService
                .createWarehouseReceivedTransfer(recivedTransfer)
                .pipe(
                  map(() => {
                    this.getTransferEmitedStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                    this.toastService.success('La Transferencia Emitida fue creado correctamente.', 'Felicidades');
                  }),
                )
                .subscribe();
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<TranferEmitedStockFormComponent, any>;

    dialogRef = this.dialog.open(TranferEmitedStockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '1000px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        transferEmited: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TranferEmitedStockFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((emitedTransfers: TransferEmitedStock) =>
          this.transferEmitedStockService.editTransferEmitedStock({ ...emitedTransfers, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Transferencia Emitida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTransferEmitedStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Transferencia Emitida fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteTransferEmitedStock(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Transferencia Emitida seleccionanda?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.transferEmitedStockService.deleteTransferEmitedStock(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Transferencia Emitida. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTransferEmitedStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Transferencia Emitida fue eliminado correctamente.', 'Felicidades');
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
    this.getTransferEmitedStock(this.filters, sort.active, sort.direction);
  }
}
