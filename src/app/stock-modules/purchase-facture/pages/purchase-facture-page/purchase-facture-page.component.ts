import { PurchaseFactureService } from './../../services/purchase-facture.service';
import { PURCHASE_FACTURE_TABLE_CONFIGURATION } from './../../models/purchase-facture-table-configuration';
import { PurchaseFacture } from './../../models/purchase-facture.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PurchaseFactureFormComponent } from '../../components/purchase-facture-form/purchase-facture-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-purchase-facture-page',
  templateUrl: './purchase-facture-page.component.html',
  styleUrls: ['./purchase-facture-page.component.scss'],
})
export class PurchaseFacturePageComponent implements OnInit, OnDestroy {
  purchaseFacture: PurchaseFacture[];
  dataCount = 0;
  configuration = PURCHASE_FACTURE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Factura de venta',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Factura de venta',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deletePurchaseFacture(item),
    },
  ];

  constructor(
    private purchaseFactureService: PurchaseFactureService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getEstado();
  }

  ngOnInit(): void {
    this.getPurchaseFacture();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getEstado(filters = {}) {
    const sub = this.purchaseFactureService
      .getEstado()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getPurchaseFacture(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.purchaseFactureService
      .getPurchaseFacture(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.purchaseFacture = response.results.map((res) => ({
            ...res,
            operacion_comercial_id:res.operacion_comercial.id,
            estado_id: res.estado.id,
            estado_descrip: res.estado.descripcion,
            comercial_id:res.comercial.id,
            compra_id: res.compra.id
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
    this.getPurchaseFacture(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getPurchaseFacture(filters, 'id', 'desc');
  }

  createPurchaseFacture() {
    let dialogRef: MatDialogRef<PurchaseFactureFormComponent, any>;

    dialogRef = this.dialog.open(PurchaseFactureFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        purchaseFacture: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as PurchaseFactureFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((purchaseFacture: PurchaseFacture) =>
          this.purchaseFactureService.createPurchaseFacture(purchaseFacture).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Factura de compra. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPurchaseFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura de compra fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<PurchaseFactureFormComponent, any>;

    dialogRef = this.dialog.open(PurchaseFactureFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        purchaseFacture: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as PurchaseFactureFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((purchaseFacture: PurchaseFacture) =>
          this.purchaseFactureService.editPurchaseFacture({ ...purchaseFacture, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la factura de compra. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPurchaseFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura de compra fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deletePurchaseFacture(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Factura de compra?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.purchaseFactureService.deletePurchaseFacture(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Factura de compra. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPurchaseFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura de compra fue eliminada correctamente.', 'Felicidades');
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
    this.getPurchaseFacture(this.filters, sort.active, sort.direction);
  }
}
