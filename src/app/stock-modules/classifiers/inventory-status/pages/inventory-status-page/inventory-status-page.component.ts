import { InventoryStatusService } from '../../services/inventory-status.service';
import { INVENTORY_STATUS_TABLE_CONFIGURATION } from '../../models/inventory-status-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { InventoryStatus } from '../../models/inventory-status.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InventoryStatusFormComponent } from '../../components/inventory-status-form/inventory-status-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-inventory-status-page',
  templateUrl: './inventory-status-page.component.html',
  styleUrls: ['./inventory-status-page.component.scss'],
})
export class InventoryStatusPageComponent implements OnInit, OnDestroy {
  inventoryStatus: InventoryStatus[];
  dataCount = 0;
  configuration = INVENTORY_STATUS_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Estado de Inventario',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Estado de Inventario',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteInventoryStatus(item),
    },
  ];

  constructor(private inventoryStatusService: InventoryStatusService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getInventoryStatus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getInventoryStatus(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.inventoryStatusService
      .getInventoryStatus(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<InventoryStatus>) => {
          this.inventoryStatus = response.results;
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
    this.getInventoryStatus(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getInventoryStatus(filters, 'id', 'desc');
  }

  createInventoryStatus() {
    let dialogRef: MatDialogRef<InventoryStatusFormComponent, any>;

    dialogRef = this.dialog.open(InventoryStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        inventoryStatus: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InventoryStatusFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((inventoryStatus: InventoryStatus) =>
          this.inventoryStatusService.createInventoryStatus(inventoryStatus).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Estado del inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado del inventario fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<InventoryStatusFormComponent, any>;

    dialogRef = this.dialog.open(InventoryStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        inventoryStatus: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InventoryStatusFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((inventoryStatus: InventoryStatus) =>
          this.inventoryStatusService.editInventoryStatus({ ...inventoryStatus, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el estado del inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado del inventario fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteInventoryStatus(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el estado del inventario: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.inventoryStatusService.deleteInventoryStatus(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el estado del inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado del inventario fue eliminada correctamente.', 'Felicidades');
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
    this.getInventoryStatus(this.filters, sort.active, sort.direction);
  }
}
