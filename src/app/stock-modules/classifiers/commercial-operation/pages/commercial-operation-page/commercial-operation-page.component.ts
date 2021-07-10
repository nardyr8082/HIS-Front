import { CommercialOperationService } from '../../services/commercial-operation.service';
import { COMMERCIAL_OPERATION_TABLE_CONFIGURATION } from '../../models/commercial-operation-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { CommercialOperation } from '../../models/commercial-operation.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommercialOperationFormComponent } from '../../components/commercial-operation-form/commercial-operation-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-commercial-operation-page',
  templateUrl: './commercial-operation-page.component.html',
  styleUrls: ['./commercial-operation-page.component.scss'],
})
export class CommercialOperationPageComponent implements OnInit, OnDestroy {
  commercialOperations: CommercialOperation[];
  dataCount = 0;
  configuration = COMMERCIAL_OPERATION_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Operación Comercial',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Operación Comercial',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteCommercialOperation(item),
    },
  ];

  constructor(private commercialOperationService: CommercialOperationService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCommercialOperations();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getCommercialOperations(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.commercialOperationService
      .getCommercialOperations(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<CommercialOperation>) => {
          this.commercialOperations = response.results;
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
    this.getCommercialOperations(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getCommercialOperations(filters, 'id', 'desc');
  }

  createCommercialOperation() {
    let dialogRef: MatDialogRef<CommercialOperationFormComponent, any>;

    dialogRef = this.dialog.open(CommercialOperationFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        commercialOperation: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CommercialOperationFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((commercialOperation: CommercialOperation) =>
          this.commercialOperationService.createCommercialOperation(commercialOperation).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la operación comercial. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCommercialOperations(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La operación comercial fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<CommercialOperationFormComponent, any>;

    dialogRef = this.dialog.open(CommercialOperationFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        commercialOperation: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CommercialOperationFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((commercialOperation: CommercialOperation) =>
          this.commercialOperationService.editCommercialOperation({ ...commercialOperation, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la operación comercial. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCommercialOperations(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La operación comercial fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteCommercialOperation(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la operación comercial: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.commercialOperationService.deleteCommercialOperation(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la operación comercial. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCommercialOperations(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Operación Comercial fue eliminado correctamente.', 'Felicidades');
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
    this.getCommercialOperations(this.filters, sort.active, sort.direction);
  }
}
