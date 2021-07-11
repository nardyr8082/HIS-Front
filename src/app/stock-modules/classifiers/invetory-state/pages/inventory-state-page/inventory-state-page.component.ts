import { InventoryStateFormComponent } from './../../components/inventory-state-form/inventory-state-form.component';

import { ToastrService } from 'ngx-toastr';
import { InventoryStateService } from './../../services/inventory-state.service';
import { INVENTORY_STATE_TABLE_CONFIGURATION } from './../../models/inventory-state-table-configuration';
import { InventoryState } from './../../models/inventory-state.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-inventory-state-page',
  templateUrl: './inventory-state-page.component.html',
  styleUrls: ['./inventory-state-page.component.scss'],
})
export class InventoryStatePageComponent implements OnInit {
  inventoryStates: InventoryState[];
  dataCount = 0;
  configuration = INVENTORY_STATE_TABLE_CONFIGURATION;
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
      callback: (item) => this.deleteProgram(item),
    },
  ];

  constructor(private inventoryStateService: InventoryStateService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getInventoryStates();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getInventoryStates(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.inventoryStateService
      .getInventoryStates(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<InventoryState>) => {
          this.inventoryStates = response.results;
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
    this.getInventoryStates(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getInventoryStates(filters, 'id', 'desc');
  }

  createInvetoryState() {
    let dialogRef: MatDialogRef<InventoryStateFormComponent, any>;

    dialogRef = this.dialog.open(InventoryStateFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        inventoryState: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InventoryStateFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((inventoryState: InventoryState) =>
          this.inventoryStateService.createInventoryState(inventoryState).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el estado de inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryStates(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de inventario fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<InventoryStateFormComponent, any>;

    dialogRef = this.dialog.open(InventoryStateFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        inventoryState: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InventoryStateFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((inventoryState: InventoryState) =>
          this.inventoryStateService.editInventoryState({ ...inventoryState, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el estado de inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryStates(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de inventario fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteProgram(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el estado de inventario: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.inventoryStateService.deleteInventoryState(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el estado de inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryStates(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de inventario fue eliminado correctamente.', 'Felicidades');
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
    this.getInventoryStates(this.filters, sort.active, sort.direction);
  }
}
