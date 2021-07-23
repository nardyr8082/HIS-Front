import { SaleFactureService } from './../../services/sale-facture.service';
import { SALE_FACTURE_TABLE_CONFIGURATION } from './../../models/sale-facture-table-configuration';
import { SaleFacture } from './../../models/sale-facture.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { SaleFactureFormComponent } from '../../components/sale-facture-form/sale-facture-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-sale-facture-page',
  templateUrl: './sale-facture-page.component.html',
  styleUrls: ['./sale-facture-page.component.scss'],
})
export class SaleFacturePageComponent implements OnInit, OnDestroy {
  salefacture: SaleFacture[];
  dataCount = 0;
  configuration = SALE_FACTURE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Factura',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Factura',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteSaleFacture(item),
    },
  ];

  constructor(
    private salefactureService: SaleFactureService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getEstado();
  }

  ngOnInit(): void {
    this.getSaleFacture();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getEstado(filters = {}) {
    const sub = this.salefactureService
      .getEstado()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getSaleFacture(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.salefactureService
      .getSaleFacture(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.salefacture = response.results.map((res) => ({
            ...res,
            operacion_comercial_id:res.operacion_comercial.id,
            estado_id: res.estado.id,
            estado_descrip: res.estado.descripcion,
            comercial_id:res.comercial.id,
            venta_id: res.venta.id
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
    this.getSaleFacture(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getSaleFacture(filters, 'id', 'desc');
  }

  createSaleFacture() {
    let dialogRef: MatDialogRef<SaleFactureFormComponent, any>;

    dialogRef = this.dialog.open(SaleFactureFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        salefacture: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SaleFactureFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((salefacture: SaleFacture) =>
          this.salefactureService.createSaleFacture(salefacture).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSaleFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<SaleFactureFormComponent, any>;

    dialogRef = this.dialog.open(SaleFactureFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        salefacture: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as SaleFactureFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((salefacture: SaleFacture) =>
          this.salefactureService.editSaleFacture({ ...salefacture, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSaleFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteSaleFacture(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Factura?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.salefactureService.deleteSaleFacture(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSaleFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura fue eliminada correctamente.', 'Felicidades');
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
    this.getSaleFacture(this.filters, sort.active, sort.direction);
  }
}
