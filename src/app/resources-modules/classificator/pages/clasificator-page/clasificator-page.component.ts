import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ClasificatorFormComponent } from './../../components/clasificator-form/clasificator-form.component';
import { ToastrService } from 'ngx-toastr';
import { ClasificatorService } from './../../services/clasificator.service';
import { CLASIFICATOR_TABLE_CONFIGURATION } from './../../models/clasificator-table-configuration';
import { Clasificator } from './../../models/clasificator.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Permission, Role } from '../../../../security-module/role/models/role.model';
import { ResourceType } from '../../../type/models/type';

@Component({
  selector: 'app-clasificator-page',
  templateUrl: './clasificator-page.component.html',
  styleUrls: ['./clasificator-page.component.scss'],
})
export class ClasificatorPageComponent implements OnInit {
  clasificators: Clasificator[];
  dataCount = 0;
  configuration = CLASIFICATOR_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Clasificador',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Clasificador',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteClasificator(item),
    },
  ];

  constructor(private clasificatorService: ClasificatorService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getClasificators();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getClasificators(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.clasificatorService
      .getClasificators(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Clasificator>) => {
          this.clasificators = response.results.map((response) => {
            const tipoString = this.getTipoString(response.tipo);
            return { ...response, tipo_string: tipoString };
          });
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
  getTipoString(tipos: ResourceType) {
    return tipos.descripcion;
  }
  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getClasificators(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getClasificators(filters, 'id', 'desc');
  }

  createClasificator() {
    let dialogRef: MatDialogRef<ClasificatorFormComponent, any>;

    dialogRef = this.dialog.open(ClasificatorFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        clasificator: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ClasificatorFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((clasificator: Clasificator) =>
          this.clasificatorService.createClasificator(clasificator).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Clasificador. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getClasificators(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Clasificador fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ClasificatorFormComponent, any>;

    dialogRef = this.dialog.open(ClasificatorFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        clasificator: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ClasificatorFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((clasificator: Clasificator) =>
          this.clasificatorService.editClasificator({ ...clasificator, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Clasificador. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getClasificators(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Clasificador fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteClasificator(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Clasificador: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.clasificatorService.deleteClasificator(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Clasificador. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getClasificators(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Clasificador fue eliminado correctamente.', 'Felicidades');
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
    this.getClasificators(this.filters, sort.active, sort.direction);
  }
}
