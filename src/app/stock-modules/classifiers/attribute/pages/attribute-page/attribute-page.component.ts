import { AttributeFormComponent } from './../../components/attribute-form/attribute-form.component';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AttributeService } from './../../services/attribute.service';
import { ATTRIBUTE_TABLE_CONFIGURATION } from './../../models/attribute-table-configuration';
import { Attribute } from './../../models/attribute.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-attribute-page',
  templateUrl: './attribute-page.component.html',
  styleUrls: ['./attribute-page.component.scss'],
})
export class AttributePageComponent implements OnInit {
  attributes: Attribute[];
  dataCount = 0;
  configuration = ATTRIBUTE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Atributo',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Atributo',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteAttribute(item),
    },
  ];

  constructor(private attributeService: AttributeService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAttributes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getAttributes(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.attributeService
      .getAttributes(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Attribute>) => {
          this.attributes = response.results;
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
    this.getAttributes(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getAttributes(filters, 'id', 'desc');
  }

  createAttribute() {
    let dialogRef: MatDialogRef<AttributeFormComponent, any>;

    dialogRef = this.dialog.open(AttributeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        attribute: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AttributeFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((attribute: Attribute) =>
          this.attributeService.createAttribute(attribute).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el atributo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAttributes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El atributo fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<AttributeFormComponent, any>;

    dialogRef = this.dialog.open(AttributeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        attribute: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AttributeFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((attribute: Attribute) =>
          this.attributeService.editAttribute({ ...attribute, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el atributo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAttributes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El atributo fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteAttribute(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el atributo: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.attributeService.deleteAttribute(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el atributo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAttributes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El atributo fue eliminado correctamente.', 'Felicidades');
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
    this.getAttributes(this.filters, sort.active, sort.direction);
  }
}
