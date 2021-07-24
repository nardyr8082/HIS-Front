import { WAREHOUSE_RECEIVED_TRANSFER_TABLE_CONFIGURATION } from './../../models/warehouse-received-transfer-table-configuration';
import { WarehouseReceivedTransferService } from '../../services/warehouse-received-transfer.service';
import { WarehouseReceivedTransferFormComponent } from '../../components/warehouse-received-transfer-form/warehouse-received-transfer-form.component';
import { WarehouseReceivedTransfer } from '../../models/warehouse-received-transfer.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-warehouse-received-transfer-page',
  templateUrl: './warehouse-received-transfer-page.component.html',
  styleUrls: ['./warehouse-received-transfer-page.component.scss']
})
export class WarehouseReceivedTransferPageComponent implements OnInit {
  warehouseReceivedTransfer: WarehouseReceivedTransfer[];
  dataCount = 0;
  configuration = WAREHOUSE_RECEIVED_TRANSFER_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Transferencia',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Transferencia',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteWarehouseReceivedTransfer(item),
    },
  ];



  constructor(
    private warehouseReceivedTransferService: WarehouseReceivedTransferService,
    private toastService: ToastrService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.getWarehouseReceivedTransfer();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getWarehouseReceivedTransfer(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.warehouseReceivedTransferService
      .getWarehouseReceivedTransfer(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.warehouseReceivedTransfer = response.results.map((res) => ({
            ...res,
            id: res.id,
            movimiento: res.movimiento.comentario,
            movimiento_id: res.movimiento.id,
            movimiento_origen: res.movimiento_origen.comentario,
            movimiento_origen_id: res.movimiento_origen.id,

          }));
          console.log(response);
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
    this.getWarehouseReceivedTransfer(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getWarehouseReceivedTransfer(filters, 'id', 'desc');
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<WarehouseReceivedTransferFormComponent, any>;

    dialogRef = this.dialog.open(WarehouseReceivedTransferFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        warehouseReceivedTransfer: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as WarehouseReceivedTransferFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((warehouseReceivedTransfer: WarehouseReceivedTransfer) =>
          this.warehouseReceivedTransferService.editWarehouseReceivedTransfer({ ...warehouseReceivedTransfer, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Transferencia . Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWarehouseReceivedTransfer(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Transferencia fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteWarehouseReceivedTransfer(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Transferencia : ${item.movimiento}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.warehouseReceivedTransferService.deleteWarehouseReceivedTransfer(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Trasnferencia . Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWarehouseReceivedTransfer(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Transferencia fue eliminado correctamente.', 'Felicidades');
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
    this.getWarehouseReceivedTransfer(this.filters, sort.active, sort.direction);
  }

}
