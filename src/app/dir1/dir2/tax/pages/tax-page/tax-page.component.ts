import { TaxService } from '../../services/tax.service';
import { TAX_TABLE_CONFIGURATION } from '../../models/tax-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Tax } from '../../models/tax.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaxFormComponent } from '../../components/tax-form/tax-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-tax-page',
  templateUrl: './tax-page.component.html',
  styleUrls: ['./tax-page.component.scss'],
})
export class TaxPageComponent implements OnInit, OnDestroy {
  taxs: Tax[];
  dataCount = 0;
  configuration = TAX_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Impuesto',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Impuesto',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteTax(item),
    },
  ];

  constructor(private taxService: TaxService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTaxs();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getTaxs(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.taxService
      .getTaxs(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Tax>) => {
          this.taxs = response.results;
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
    this.getTaxs(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getTaxs(filters, 'id', 'desc');
  }

  createTax() {
    let dialogRef: MatDialogRef<TaxFormComponent, any>;

    dialogRef = this.dialog.open(TaxFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        tax: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TaxFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((tax: Tax) =>
          this.taxService.createTax(tax).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el impuesto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTaxs(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El impuesto fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<TaxFormComponent, any>;

    dialogRef = this.dialog.open(TaxFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        tax: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as TaxFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((tax: Tax) =>
          this.taxService.editTax({ ...tax, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el impuesto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTaxs(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El impuesto fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteTax(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el impuesto: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.taxService.deleteTax(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el impuesto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getTaxs(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El impuesto fue eliminado correctamente.', 'Felicidades');
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
    this.getTaxs(this.filters, sort.active, sort.direction);
  }
}
