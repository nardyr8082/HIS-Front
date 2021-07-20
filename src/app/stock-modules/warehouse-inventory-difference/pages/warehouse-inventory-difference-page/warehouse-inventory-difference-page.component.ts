
import { WarehouseInventoryDifference_TABLE_CONFIGURATION } from './../../models/warehouse-inventory-difference-table-configuration';
import { WarehouseInventoryDiference } from './../../models/warehouse-inventory-difference.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WarehouseInventoryDifferenceService } from './../../services/warehouse-inventory-difference.service';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { WarehouseInventoryDifferenceFormComponent } from './../../components/warehouse-inventory-difference-form/warehouse-inventory-difference-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-warehouse-inventory-difference-page',
  templateUrl: './warehouse-inventory-difference-page.component.html',
  styleUrls: ['./warehouse-inventory-difference-page.component.scss']
})
export class WarehouseInventoryDifferencePageComponent implements OnInit, OnDestroy {
  wareHouseInventoryDif: WarehouseInventoryDiference[];
  dataCount = 0;
  configuration = WarehouseInventoryDifference_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Almacen Inventario Diferencia ',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Almacen Inventario Diferencia',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteWareHouseInventDif(item),
    },
  ];

  constructor(
    private ware_house_inventory_dif_service: WarehouseInventoryDifferenceService,
    private toastService: ToastrService,
    public dialog: MatDialog
  ) {
    this.putConteo();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.getWareHouseInventoryDif();
    this.getConteo();
  }

  putConteo() { }

  getWareHouseInventoryDif(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.ware_house_inventory_dif_service
      .getWareHouseInventoryDif(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.wareHouseInventoryDif = response.results.map((res) => ({
            ...res,

            ware_house_inventory_id: res.ware_house_inventory.id,
            ware_house_inventory_dif_cantidad: res.ware_house_inventory.dif_cantidad,
            ware_house_inventory_dif_importe: res.ware_house_inventory_dif_importe

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
    this.getWareHouseInventoryDif(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getWareHouseInventoryDif(filters, 'id', 'desc');
  }

  getConteo() { }



  createWareHouseInventDif() {
    let dialogRef: MatDialogRef<WarehouseInventoryDifferenceFormComponent, any>;
    dialogRef = this.dialog.open(WarehouseInventoryDifferenceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        wareHouseInventoryDif: null,

      },
    });

    const modalComponentRef = dialogRef.componentInstance as WarehouseInventoryDifferenceFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((wareHouseInventoryDif: WarehouseInventoryDiference) =>
          this.ware_house_inventory_dif_service.createWareHouseInventDif(wareHouseInventoryDif).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Almacen de Inventario Diferencia . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWareHouseInventoryDif(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('El Almacen de Inventario Diferencia  fue creado correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {

    let dialogRef: MatDialogRef<WarehouseInventoryDifferenceFormComponent, any>;

    dialogRef = this.dialog.open(WarehouseInventoryDifferenceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        wareHouseInventoryDif: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as WarehouseInventoryDifferenceFormComponent;

    const sub = modalComponentRef.edit
      .pipe(

        switchMap((wareHouseInventoryDif: WarehouseInventoryDiference) =>
          this.ware_house_inventory_dif_service.editWareHouseInventDif({ ...wareHouseInventoryDif, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Almacen de Inventario Diferencia . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWareHouseInventoryDif(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('El Almacen de Inventario Diferencia  fue modificado correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteWareHouseInventDif(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;

    modalComponentRef.text = `¿Está seguro que desea eliminar Almacen de Inventario Diferencia : ${item.id}?`;


    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.ware_house_inventory_dif_service.deleteWareHouseInventDif(item.id).pipe(
            map(() => item),
            catchError(() => {

              this.toastService.error('Hubo un error al eliminar el Almacen de Inventario Diferencia . Por favor, inténtelo de nuevo más tarde.', 'Error');

              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWareHouseInventoryDif(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('El Almacen de Inventario Diferencia fue eliminado correctamente.', 'Felicidades');

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

    this.getWareHouseInventoryDif(this.filters, sort.active, sort.direction);
  }



}
