import { SaleService } from './../../services/sale.service';
import {SALE_TABLE_CONFIGURATION } from './../../models/sale-table-configuration';
import { Sale } from './../../models/sale.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { SaleFormComponent } from '../../components/sale-form/sale-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-sale-page',
  templateUrl: './sale-page.component.html',
  styleUrls: ['./sale-page.component.scss'],
})
export class SalePageComponent implements OnInit, OnDestroy {
  sale: Sale[];
  dataCount = 0;
  configuration = SALE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Venta',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Venta',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteSale(item),
    },
  ];

  constructor(
    private saleService: SaleService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getEstado();
    this.getAlmacen();
  }

  ngOnInit(): void {
    this.getSale();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getEstado(filters = {}) {
    const sub = this.saleService
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
    const sub = this.saleService
      .getAlmacen()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getSale(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.saleService
      .getSale(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.sale = response.results.map((res) => ({
            ...res,
            estado_descrip: res.estado.descripcion,
            estado_id:res.estado.id,
            almacen_id: res.almacen.id,
            almacen_nombre: res.almacen.nombre,
            tipo_mov_id:res.tipo_de_movimiento.id,
            tipo_mov_descrip:res.tipo_de_movimiento.descripcion,
            usuario_id:res.usuario.id,
            usuario_nombre:res.usuario.first_name
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
    this.getSale(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getSale(filters, 'id', 'desc');
  }

  createSale() {
    let dialogRef: MatDialogRef<SaleFormComponent, any>;

    dialogRef = this.dialog.open(SaleFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        sale: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SaleFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((sale: Sale) =>
          this.saleService.createSale(sale).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Venta. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSale(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Venta fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<SaleFormComponent, any>;

    dialogRef = this.dialog.open(SaleFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        sale: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as SaleFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((sale: Sale) =>
          this.saleService.editSale({ ...sale, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Venta. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSale(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Venta fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteSale(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Venta?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.saleService.deleteSale(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Venta. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSale(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Venta fue eliminada correctamente.', 'Felicidades');
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
    this.getSale(this.filters, sort.active, sort.direction);
  }
}
