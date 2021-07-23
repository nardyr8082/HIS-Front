import { PurchaseService } from './../../services/purchase.service';
import {PURCHASE_TABLE_CONFIGURATION } from './../../models/purchase-table-configuration';
import { Purchase } from './../../models/purchase.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PurchaseFormComponent } from '../../components/purchase-form/purchase-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-purchase-page',
  templateUrl: './purchase-page.component.html',
  styleUrls: ['./purchase-page.component.scss'],
})
export class PurchasePageComponent implements OnInit, OnDestroy {
  purchase: Purchase[];
  dataCount = 0;
  configuration = PURCHASE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Compra',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Compra',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deletePurchase(item),
    },
  ];

  constructor(
    private purchaseService: PurchaseService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getEstado();
    this.getAlmacen();
  }

  ngOnInit(): void {
    this.getPurchase();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getEstado(filters = {}) {
    const sub = this.purchaseService
      .getEstado()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getAlmacen(filters = {}) {
    const sub = this.purchaseService
      .getAlmacen()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getPurchase(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.purchaseService
      .getPurchase(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.purchase = response.results.map((res) => ({
            ...res,
            estado_descrip: res.estado.descripcion,
            estado_id:res.estado.id,
            almacen_id: res.almacen.id,
            almacen_nombre: res.almacen.nombre,
            tipo_mov_id:res.tipo_de_movimiento.id,
            tipo_mov_descrip:res.tipo_de_movimiento.descripcion,
            usuario_id:res.usuario.id,
            usuario_nombre:res.usuario.first_name,
            proveedor_id:res.usuario.id,
            proveedor_nombre:res.usuario.nombre
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
    this.getPurchase(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getPurchase(filters, 'id', 'desc');
  }

  createPurchase() {
    let dialogRef: MatDialogRef<PurchaseFormComponent, any>;

    dialogRef = this.dialog.open(PurchaseFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        purchase: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as PurchaseFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((purchase: Purchase) =>
          this.purchaseService.createPurchase(purchase).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Compra. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPurchase(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Compra fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<PurchaseFormComponent, any>;

    dialogRef = this.dialog.open(PurchaseFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        purchase: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as PurchaseFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((purchase: Purchase) =>
          this.purchaseService.editPurchase({ ...purchase, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Compra. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPurchase(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Compra fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deletePurchase(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Compra?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.purchaseService.deletePurchase(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Compra. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPurchase(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Compra fue eliminada correctamente.', 'Felicidades');
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
    this.getPurchase(this.filters, sort.active, sort.direction);
  }
}
