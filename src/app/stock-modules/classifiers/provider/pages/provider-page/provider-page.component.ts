import { ToastrService } from 'ngx-toastr';
import { ProviderService } from './../../services/provider.service';
import { PROVIDER_TABLE_CONFIGURATION } from '../../models/provider-table-configuration';
import { Provider } from './../../models/provider.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, switchMap, map, tap } from 'rxjs/operators';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ProviderFormComponent } from '../../components/provider-form/provider-form.component';

@Component({
  selector: 'app-provider-page',
  templateUrl: './provider-page.component.html',
  styleUrls: ['./provider-page.component.scss'],
})
export class ProviderPageComponent implements OnInit {
  providers: Provider[];
  dataCount = 0;
  configuration = PROVIDER_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Proveedor',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Proveedor',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteProvider(item),
    },
  ];

  constructor(private taxService: ProviderService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProviders();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getProviders(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.taxService
      .getProviders(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Provider>) => {
          this.providers = response.results;
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
    this.getProviders(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getProviders(filters, 'id', 'desc');
  }

  createProvider() {
    let dialogRef: MatDialogRef<ProviderFormComponent, any>;

    dialogRef = this.dialog.open(ProviderFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '1000px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        provider: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProviderFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((provider: Provider) =>
          this.taxService.createProvider(provider).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el proveedor. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProviders(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El proveedor fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ProviderFormComponent, any>;

    dialogRef = this.dialog.open(ProviderFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '1000px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        provider: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProviderFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((provider: Provider) =>
          this.taxService.editProvider({ ...provider, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el proveedor. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProviders(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El proveedor fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteProvider(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el proveedor: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.taxService.deleteProvider(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el proveedor. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProviders(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El proveedor fue eliminado correctamente.', 'Felicidades');
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
    this.getProviders(this.filters, sort.active, sort.direction);
  }
}
