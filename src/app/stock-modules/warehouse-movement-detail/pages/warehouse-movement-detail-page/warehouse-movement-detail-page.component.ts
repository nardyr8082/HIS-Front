import { WAREHOUSE_MOVEMENT_DETAIL_TABLE_CONFIGURATION } from './../../models/warehouse-movement-detail-table-configuration';
import { WarehouseMovementDetailService } from '../../services/warehouse-movement-detail.service';
import { MeasureService } from 'src/app/stock-modules/classifiers/measure/services/measure.service';
/* import {Movement} */
import { WarehouseProductService } from 'src/app/stock-modules/warehouse-lot/services/warehouse-product.service';
import { WarehouseMovementDetail } from '../../models/warehouse-movement-detail.model';
import { WarehouseMovementDetailFormComponent } from '../../components/warehouse-movement-detail-form/warehouse-movement-detail-form.component';
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
  selector: 'app-warehouse-movement-detail-page',
  templateUrl: './warehouse-movement-detail-page.component.html',
  styleUrls: ['./warehouse-movement-detail-page.component.scss']
})
export class WarehouseMovementDetailPageComponent implements OnInit {
  warehouseMovementDetail: WarehouseMovementDetail[];
  dataCount = 0;
  configuration = WAREHOUSE_MOVEMENT_DETAIL_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Detalle Movimiento',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Detalle Movimiento',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteWarehouseMovementDetail(item),
    },
  ];


  constructor(
    private warehouseMovementDetailService: WarehouseMovementDetailService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private measureService: MeasureService,
    private warehouseProductService: WarehouseProductService,
) {
  this.putMeasure();
  this.putWarehouseMove();
  this.putWarehouseProduct();
 }

  ngOnInit(): void {
    this.getWarehouseMovementDetail();

    this.getMeasure();
    this.getWarehouseProduct();


  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  putMeasure(filters = {}) {
    const sub = this.measureService
      .getMeasures(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log(response.results);
          this.configuration.tableFilters[6].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
   
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putWarehouseMove(filters = {}) {
    const sub = this.warehouseMovementDetailService
      .getMovement()
      .pipe(
        map((response: ApiResponse<any>) => {
   console.log(response.results);
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name:res.comentario }));
        }),
      )
      .subscribe();


    this.subscriptions.push(sub);
  }

  putWarehouseProduct(filters = {}) {
    const sub = this.warehouseProductService
      .geWarehouseProduct(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log(response.results);
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id,  name:res.descripcion }));
        }),
      )
      .subscribe();
   
    this.subscriptions.push(sub);
  }

  getMeasure() {
    const sub = this.measureService
      .getMeasures({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getWarehouseProduct() {
    const sub = this.warehouseProductService
      .geWarehouseProduct({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();
    console.log(this.configuration)
    this.subscriptions.push(sub);
  }

  getWarehouseMovementDetail(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.warehouseMovementDetailService
      .getWarehouseMovementDetail(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.warehouseMovementDetail = response.results.map((res) => ({
            ...res,
            id: res.id,
            cantidad: res.cantidad,
            precio: res.precio,
            importe: res.importe,
            existencia: res.existencia,
            movimiento: res.movimiento.comentario,
            movimiento_id: res.movimiento.id,
            producto: res.producto.descripcion,
            producto_id: res.producto.id,
            unidad_medida: res.unidad_medida.descripcion,
            unidad_medida_id: res.unidad_medida.id
          }));
          console.log(response);
          console.log(this.warehouseMovementDetail);

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
    this.getWarehouseMovementDetail(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getWarehouseMovementDetail(filters, 'id', 'desc');
  }

  createWarehouseMovementDetail() {
    let dialogRef: MatDialogRef<WarehouseMovementDetailFormComponent, any>;

    dialogRef = this.dialog.open(WarehouseMovementDetailFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '700px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        warehouseMovementDetail: null,
      },
      disableClose: true,
    });

    const modalComponentRef = dialogRef.componentInstance as WarehouseMovementDetailFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((WarehouseMovementDetail: WarehouseMovementDetail) =>
          this.warehouseMovementDetailService.createWarehouseMovementDetail(WarehouseMovementDetail).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Detalle Movimiento . Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWarehouseMovementDetail(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Detalle Movimiento fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<WarehouseMovementDetailFormComponent, any>;

    dialogRef = this.dialog.open(WarehouseMovementDetailFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '700px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        warehouseMovementDetail: item,
      },
      disableClose: true,
    });
    const modalComponentRef = dialogRef.componentInstance as WarehouseMovementDetailFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((WarehouseMovementDetail: WarehouseMovementDetail) =>
          this.warehouseMovementDetailService.editWarehouseMovementDetail({ ...WarehouseMovementDetail, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Detalle Movimiento . Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWarehouseMovementDetail(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Detalle Movimiento fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteWarehouseMovementDetail(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Detalle Movimiento : ${item.movimiento}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.warehouseMovementDetailService.deleteWarehouseMovementDetail(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Detalle Movimiento . Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWarehouseMovementDetail(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Detalle Movimiento fue eliminado correctamente.', 'Felicidades');
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
    this.getWarehouseMovementDetail(this.filters, sort.active, sort.direction);
  }

}


