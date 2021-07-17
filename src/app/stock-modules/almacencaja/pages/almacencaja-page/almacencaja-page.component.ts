import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Almacencaja_TABLE_CONFIGURATION } from '../../models/almacencaja-table-configuration';
import { AlmacencajaFormComponent } from '../../components/almacencaja-form/almacencaja-form.component';
import { Almacencaja } from '../../models/almacencaja.model';
import { AlmacencajaService } from '../../services/almacencaja.service';

@Component({
  selector: 'app-almacencaja-page',
  templateUrl: './almacencaja-page.component.html',
  styleUrls: ['./almacencaja-page.component.scss'],
})
export class AlmacencajaPageComponent implements OnInit {
  almacen: Almacencaja[];
  dataCount = 0;
  configuration = Almacencaja_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Almacen Caja',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Almacen Caja',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteAlmacencaja(item),
    },
  ];

  constructor(private almacencajaService: AlmacencajaService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAlmacencaja();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getAlmacencaja(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.almacencajaService
      .getAlmacencaja(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Almacencaja>) => {
          this.almacencaja = response.results.map((response) => {
            const almacenString = this.getAlmacencajaString(response.nombre);
            return { ...response, almacen_string: almacenString };
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
  getAlmacencajaString(almacen: ResourceType) {
    return almacen.nombre;
  }
  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getAlmacencaja(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getAlmacencaja(filters, 'id', 'desc');
  }

  createClasificator() {
    let dialogRef: MatDialogRef<AlmacencajaFormComponent, any>;

    dialogRef = this.dialog.open(AlmacencajaFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        clasificator: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AlmacencajaFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((almacencaja: Almacencaja) =>
          this.almacencajaService.createAlmacencaja(almacencaja).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Almacen caja. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAlmacencaja(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacen caja fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<AlmacencajaFormComponent, any>;

    dialogRef = this.dialog.open(AlmacencajaFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        clasificator: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AlmacencajaFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((almacencaja: Almacencaja) =>
          this.almacencajaService.editAlmacencaja({ ...almacencaja, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Almacen caja. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAlmacencaja(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacen caja fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteAlmacencaja(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Almacen caja: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.almacencajaService.deleteAlmacencaja(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Almacen caja. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAlmacencaja(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El almacen caja fue eliminado correctamente.', 'Felicidades');
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
    this.getAlmacencaja(this.filters, sort.active, sort.direction);
  }
}
