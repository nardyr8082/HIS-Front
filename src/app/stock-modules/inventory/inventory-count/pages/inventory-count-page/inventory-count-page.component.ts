import { InventoryCountService } from './../../services/inventory-count.service';
import { INVENTORY_COUNT_TABLE_CONFIGURATION } from './../../models/inventory-count-table-configuration';
import { InventoryCount } from './../../models/inventory-count.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../../core/models/api-response.model';
import { InventoryCountFormComponent } from '../../components/inventory-count-form/inventory-count-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-inventory-count-page',
  templateUrl: './inventory-count-page.component.html',
  styleUrls: ['./inventory-count-page.component.scss'],
})
export class InventoryCountPageComponent implements OnInit, OnDestroy {
  inventoryCount: InventoryCount[];
  dataCount = 0;
  configuration = INVENTORY_COUNT_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Conteo de Inventario',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Conteo de Inventario',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteInventoryCount(item),
    },
  ];

  constructor(
    private inventoryCountService: InventoryCountService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private indicatorService: IndicatorService,
  ) {
    this.getIndicator();
  }

  ngOnInit(): void {
    this.getInventoryCount();
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

  getInventoryCount(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.inventoryCountService
      .getInventoryCount(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.inventoryCount = response.results.map((res) => ({
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
    this.getInventoryCount(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getInventoryCount(filters, 'id', 'desc');
  }

  createInventoryCount() {
    let dialogRef: MatDialogRef<InventoryCountFormComponent, any>;

    dialogRef = this.dialog.open(InventoryCountFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        inventoryCount: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InventoryCountFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((inventoryCount: InventoryCount) =>
          this.inventoryCountService.createInventoryCount(inventoryCount).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Conteo de Inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryCount(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Conteo de Inventario fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<InventoryCountFormComponent, any>;

    dialogRef = this.dialog.open(InventoryCountFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        inventoryCount: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as InventoryCountFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((inventoryCount: InventoryCount) =>
          this.inventoryCountService.editInventoryCount({ ...inventoryCount, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el conteo de inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryCount(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Conteo de Inventario fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteInventoryCount(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Conteo de Inventario: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.indicatorService.deleteInventoryCount(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Conteo de Inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventoryCount(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Conteo de Inventario fue eliminado correctamente.', 'Felicidades');
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
    this.getInventoryCount(this.filters, sort.active, sort.direction);
  }
}
