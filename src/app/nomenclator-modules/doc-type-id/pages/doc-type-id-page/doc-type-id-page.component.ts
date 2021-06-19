import {Component, OnDestroy, OnInit} from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DocTypeIdFormComponent } from '../../components/doc-type-id-form/doc-type-id-form.component';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import {DocTypeId} from '../../models/doc-type-id.model';
import {DOC_TYPE_ID_TABLE_CONFIGURATION} from '../../models/doc-type-id-table-configuration';
import {DocTypeIdService} from '../../services/doc-type-id.service';

@Component({
  selector: 'app-doc-type-id-page',
  templateUrl: './doc-type-id-page.component.html',
  styleUrls: ['./doc-type-id-page.component.scss'],
})
export class DocTypeIdPageComponent implements OnInit, OnDestroy {
  docTypeId: DocTypeId[];
  dataCount = 0;
  configuration = DOC_TYPE_ID_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Tipo Documento Id',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Tipo Documento Id',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deletedocTypeId(item),
    },
  ];

  constructor(private docTypeIdService: DocTypeIdService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDocTypeId();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getDocTypeId(filters = this.filters, sortColumn = 'fecha', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.docTypeIdService
      .getDocTypeId(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<DocTypeId>) => {
          this.docTypeId = response.results;
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
    this.getDocTypeId(this.filters, 'fecha', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getDocTypeId(filters, 'fecha', 'desc');
  }

  createdocTypeId() {
    let dialogRef: MatDialogRef<DocTypeIdFormComponent, any>;

    dialogRef = this.dialog.open(DocTypeIdFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        docTypeId: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as DocTypeIdFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((docTypeId: DocTypeId) =>
          this.docTypeIdService.createDocTypeId(docTypeId).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el tipo de documento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDocTypeId();
                this.toastService.success('El tipo de documento fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<DocTypeIdFormComponent, any>;

    dialogRef = this.dialog.open(DocTypeIdFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        docTypeId: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as DocTypeIdFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((docTypeId: DocTypeId) =>
          this.docTypeIdService.editDocTypeId({ ...docTypeId, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el tipo de documento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDocTypeId();
                this.toastService.success('El tipo de documento fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deletedocTypeId(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar el tipo de documento: ${item.descripcion}`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.docTypeIdService.deleteDocTypeId(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el estado. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDocTypeId();
                this.toastService.success('El estado fue eliminado correctamente.', 'Felicidades');
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
    this.getDocTypeId(this.filters, sort.active, sort.direction);
  }
}
