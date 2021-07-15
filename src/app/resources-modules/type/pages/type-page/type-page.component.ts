import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ResourceTypeService } from './../../services/type.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { ResourceType } from '../../models/type';
import { RESOURCE_TYPE_TABLE_CONFIGURATION } from '../../models/type-table-configuration';
import { ResourceTypeFormComponent } from '../../components/type-form/type-form.component';

@Component({
  selector: 'app-type-page',
  templateUrl: './type-page.component.html',
  styleUrls: ['./type-page.component.scss'],
})
export class TypePageComponent implements OnInit {
  resourceTypes: ResourceType[];
  dataCount = 0;
  configuration = RESOURCE_TYPE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar tipo de recurso',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar tipo de recurso',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteResourceType(item),
    },
  ];

  constructor(private resourceTypeService: ResourceTypeService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getResourceType();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getResourceType(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.resourceTypeService
      .getResourceTypes(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<ResourceType>) => {
          this.resourceTypes = response.results;
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
    this.getResourceType(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getResourceType(filters, 'id', 'desc');
  }

  createResourceType() {
    let dialogRef: MatDialogRef<ResourceTypeFormComponent, any>;

    dialogRef = this.dialog.open(ResourceTypeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        resourceType: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ResourceTypeFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((resourceType: ResourceType) =>
          this.resourceTypeService.createResourceType(resourceType).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el tipo de recurso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getResourceType(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El tipo de recurso fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ResourceTypeFormComponent, any>;

    dialogRef = this.dialog.open(ResourceTypeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        resourceType: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ResourceTypeFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((resourceType: ResourceType) =>
          this.resourceTypeService.editResourceType({ ...resourceType, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el tipo de recurso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getResourceType(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El tipo de recurso fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteResourceType(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el tipo de recurso: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.resourceTypeService.deleteResourceType(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el tipo de recurso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getResourceType(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El tipo de recurso fue eliminado correctamente.', 'Felicidades');
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
    this.getResourceType(this.filters, sort.active, sort.direction);
  }
}
