import { InvoiceStatusService } from '../../services/invoice-status.service';
import { INVOICE_STATUS_TABLE_CONFIGURATION } from '../../models/invoice-status-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { InvoiceStatus } from '../../models/invoice-status.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InvoiceStatusFormComponent } from '../../components/invoice-status-form/invoice-status-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-invoice-status-page',
  templateUrl: './invoice-status-page.component.html',
  styleUrls: ['./invoice-status-page.component.scss'],
})
export class InvoiceStatusPageComponent implements OnInit, OnDestroy {
  invoiceStatus: InvoiceStatus[];
  dataCount = 0;
  configuration = INVOICE_STATUS_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Estado de Factura',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Estado de Factura',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteInvoiceStatus(item),
    },
  ];

  constructor(private invoiceStatusService: InvoiceStatusService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getInvoiceStatus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getInvoiceStatus(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.invoiceStatusService
      .getInvoiceStatus(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<InvoiceStatus>) => {
          this.invoiceStatus = response.results;
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
    this.getInvoiceStatus(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getInvoiceStatus(filters, 'id', 'desc');
  }

  createInvoiceStatus() {
    let dialogRef: MatDialogRef<InvoiceStatusFormComponent, any>;

    dialogRef = this.dialog.open(InvoiceStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        invoiceStatus: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InvoiceStatusFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((invoiceStatus: InvoiceStatus) =>
          this.invoiceStatusService.createInvoiceStatus(invoiceStatus).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Estado de la factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInvoiceStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de la factura fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<InvoiceStatusFormComponent, any>;

    dialogRef = this.dialog.open(InvoiceStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        invoiceStatus: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InvoiceStatusFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((invoiceStatus: InvoiceStatus) =>
          this.invoiceStatusService.editInvoiceStatus({ ...invoiceStatus, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el estado de la factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInvoiceStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de la factura fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteInvoiceStatus(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el estado de la factura: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.invoiceStatusService.deleteInvoiceStatus(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el estado de la factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInvoiceStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de la factura fue eliminada correctamente.', 'Felicidades');
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
    this.getInvoiceStatus(this.filters, sort.active, sort.direction);
  }
}
