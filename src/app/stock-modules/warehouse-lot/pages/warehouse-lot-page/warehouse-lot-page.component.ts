import { WarehouseLotService } from '../../services/warehouse-lot.service';
import { WAREHOUSELOT_TABLE_CONFIGURATION } from '../../models/warehouseLot-table-configuration';
import { WarehouseLot } from '../../models/warehouseLot';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { WarehouseLotFormComponent } from '../../components/warehouse-lot-form/warehouse-lot-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { warehouseProduct } from '../../models/warehouseProduct';
import { WarehouseProductService } from '../../services/warehouse-product.service';

@Component({
  selector: 'app-warehouse-lot-page',
  templateUrl: './warehouse-lot-page.component.html',
  styleUrls: ['./warehouse-lot-page.component.scss']
})
export class WarehouseLotPageComponent implements OnInit {
  warehouseLot: WarehouseLot[];
  dataCount = 0;
  configuration = WAREHOUSELOT_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  ware_house_product = [];



  rowActionButtons = [
    {
      tooltipText: 'Editar Almacen Lote',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Almacen Lote',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteWarehouseLote(item),
    },
  ];

  constructor(
    private warehouseLotService: WarehouseLotService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private warehouseProductService: WarehouseProductService
  ) {
    this.putWarehouseProduct();
  }

  ngOnInit(): void {
    this.getWareHouseLot();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  putWarehouseProduct(filters = {}) {
    const sub = this.warehouseProductService
      .geWarehouseProduct(filters, 'descripcion', 'asc', 1, 10000)

      .pipe(
        map((response) => {

          this.configuration.tableFilters[6].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  getWareHouseLot(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.warehouseLotService
      .getWarehouseLot(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log(response.results);
          this.warehouseLot = response.results.map((res) => ({
            ...res,
            id: res.id,
            codigo: res.codigo,
            codigo_barra_venta: res.codigo_barra_venta,
            precio_costo: res.precio_costo,
            precio_venta: res.precio_venta,
            fecha_fabricacion: res.fecha_fabricacion,
            fecha_vencimiento: res.fecha_vencimiento,
            retenido: res.retenido === false ? 'No retenido' : 'Retenido',
            vencido: res.vencido === false ? 'No vencido' : 'Vencido',
            producto: res.producto.descripcion,
            producto_id: res.producto.id
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
    this.getWareHouseLot(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getWareHouseLot(filters, 'id', 'desc');
  }

  createWarehouseLot() {
    let dialogRef: MatDialogRef<WarehouseLotFormComponent, any>;

    dialogRef = this.dialog.open(WarehouseLotFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {

        ware_house_product: null,

        warehouseLot: null,

      },
    });

    const modalComponentRef = dialogRef.componentInstance as WarehouseLotFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((WarehouseLot: WarehouseLot) =>
          this.warehouseLotService.createWarehouseLot(WarehouseLot).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Almacen Lote . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWareHouseLot(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('El Almacén Lote  fue creado correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {

    let dialogRef: MatDialogRef<WarehouseLotFormComponent, any>;

    dialogRef = this.dialog.open(WarehouseLotFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        warehouseLot: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as WarehouseLotFormComponent;
    const sub = modalComponentRef.edit
      .pipe(

        switchMap((WarehouseLot: WarehouseLot) =>
          this.warehouseLotService.editWarehouseLot({ ...WarehouseLot, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Almacén Lote . Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWareHouseLot(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('El Almacén Lote  fue modificado correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteWarehouseLote(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;

    modalComponentRef.text = `¿Está seguro que desea eliminar el Almacén Lote?`;


    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.warehouseLotService.deleteWarehouseLot(item.id).pipe(
            map(() => item),
            catchError(() => {

              this.toastService.error('Hubo un error al eliminar el Almacén Lote . Por favor, inténtelo de nuevo más tarde.', 'Error');

              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWareHouseLot(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('El Almacén Lote fue eliminado correctamente.', 'Felicidades');

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

    this.getWareHouseLot(this.filters, sort.active, sort.direction);
  }

}










