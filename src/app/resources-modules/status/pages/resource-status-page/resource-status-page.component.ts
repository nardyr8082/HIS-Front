import { RESOURCE_STATUS_TABLE_CONFIGURATION } from './../../models/resource-status-table-configuration';
import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ResourceStatusService } from '../../services/resource-status.service';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ResourceStatus } from '../../models/resource-status.model';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { ResourceStatusFormComponent } from '../../components/resource-status-form/resource-status-form.component';

@Component({
  selector: 'app-resource-status-page',
  templateUrl: './resource-status-page.component.html',
  styleUrls: ['./resource-status-page.component.scss'],
})
export class ResourceStatusPageComponent implements OnInit {
  resourcesStatus: ResourceStatus[];
  dataCount = 0;
  configuration = RESOURCE_STATUS_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar estado del recurso',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar estado del recurso',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteResourceStatus(item),
    },
  ];

  constructor(private resourceStatusService: ResourceStatusService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getResourceStatuss();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getResourceStatuss(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.resourceStatusService
      .getResourceStatuss(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<ResourceStatus>) => {
          this.resourcesStatus = response.results;
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
    this.getResourceStatuss(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getResourceStatuss(filters, 'id', 'desc');
  }

  createResourceStatus() {
    let dialogRef: MatDialogRef<ResourceStatusFormComponent, any>;

    dialogRef = this.dialog.open(ResourceStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        resourceStatus: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ResourceStatusFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((resourceStatus: ResourceStatus) =>
          this.resourceStatusService.createResourceStatus(resourceStatus).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el estado del recurso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getResourceStatuss(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado del recurso fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ResourceStatusFormComponent, any>;

    dialogRef = this.dialog.open(ResourceStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        resourceStatus: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ResourceStatusFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((resourceStatus: ResourceStatus) =>
          this.resourceStatusService.editResourceStatus({ ...resourceStatus, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el estado del recurso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getResourceStatuss(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado del recurso fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteResourceStatus(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el estado del recurso: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.resourceStatusService.deleteResourceStatus(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el estado del recurso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getResourceStatuss(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado del recurso fue eliminado correctamente.', 'Felicidades');
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
    this.getResourceStatuss(this.filters, sort.active, sort.direction);
  }
}
