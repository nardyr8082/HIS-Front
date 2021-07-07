import { MetaField } from './../../models/MetaField/MetaField.model';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { META_FIELD_TABLE_CONFIGURATION } from '../../models/MetaField/meta-field-table-configuration';
import { MetaFieldService } from './../../services/metaField.service';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { DEFAULT_PAGE_SIZE, ApiResponse } from 'src/app/core/models/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, catchError, switchMap, tap, filter } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { DynamicTableNomenclatorFormComponent } from '../../components/dynamic-table-nomenclator-form/dynamic-table-nomenclator-form.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-dynamic-table-nomenclator-page',
  templateUrl: './dynamic-table-nomenclator-page.component.html',
  styleUrls: ['./dynamic-table-nomenclator-page.component.scss'],
})
export class DynamicTableNomenclatorPageComponent implements OnInit {
  metaFields: MetaField[];
  dataCount = 0;
  configuration = META_FIELD_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Campo dinámico',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Campo dinámico',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteMetaFiled(item),
    },
  ];

  constructor(private metaFieldService: MetaFieldService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMetaFields();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getMetaFields(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.metaFieldService
      .getMetaFields(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<MetaField>) => {
          this.metaFields = response.results;
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
    this.getMetaFields(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getMetaFields(filters, 'id', 'desc');
  }

  createMetaField() {
    let dialogRef: MatDialogRef<DynamicTableNomenclatorFormComponent, any>;

    dialogRef = this.dialog.open(DynamicTableNomenclatorFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        metaField: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as DynamicTableNomenclatorFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((metaField: MetaField) =>
          this.metaFieldService.createMetaField(metaField).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el campo dinámico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMetaFields(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El campo dinámico fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<DynamicTableNomenclatorFormComponent, any>;

    dialogRef = this.dialog.open(DynamicTableNomenclatorFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        metaField: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as DynamicTableNomenclatorFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((metaField: MetaField) =>
          this.metaFieldService.editMetaField({ ...metaField, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el campo dinámico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMetaFields(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El campo dinámico fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteMetaFiled(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el campo dinámico: ${item.mf_datatype}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.metaFieldService.deleteMetaField(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el campo dinámico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMetaFields(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El campo dinámico fue eliminado correctamente.', 'Felicidades');
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
    this.getMetaFields(this.filters, sort.active, sort.direction);
  }
}
