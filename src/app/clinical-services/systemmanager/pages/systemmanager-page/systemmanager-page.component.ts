import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Systemmanager } from '../../models/systemmanager.model';
import { Systemmanager_TABLE_CONFIGURATION } from '../../models/systemmanager-table-configuration';
import { SystemmanagerService } from '../../services/systemmanager.service';
import { SystemmanagerFormComponent } from '../../components/systemmanager-form/systemmanager-form.component';


@Component({
  selector: 'app-systemmanager-page',
  templateUrl: './systemmanager-page.component.html',
  styleUrls: ['./systemmanager-page.component.scss'],
})
export class  SystemmanagerPageComponent implements OnInit {
  systemmanager:  Systemmanager[];
  dataCount = 0;
  configuration =  Systemmanager_TABLE_CONFIGURATION;
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
      callback: (item) => this.deleteSystemmanager(item),
    },
  ];

  constructor(private  systemmanagerService:  SystemmanagerService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getSystemmanager();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getSystemmanager(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this. systemmanagerService
      .getSystemmanager(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Systemmanager>) => {
          this.systemmanager = response.results;
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
    this.getSystemmanager(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getSystemmanager(filters, 'id', 'desc');
  }

  createSystemmanager() {
    let dialogRef: MatDialogRef<SystemmanagerFormComponent, any>;

    dialogRef = this.dialog.open(SystemmanagerFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        systemmanager: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SystemmanagerFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((systemmanager: Systemmanager) =>
          this.systemmanagerService.createSystemmanager(systemmanager).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Gestion Admisión. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSystemmanager(this.filters, 'id', 'desc', this.page, this.pageSize);
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
    let dialogRef: MatDialogRef<SystemmanagerFormComponent, any>;

    dialogRef = this.dialog.open(SystemmanagerFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        systemmanager: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SystemmanagerFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((systemmanager: Systemmanager) =>
          this.systemmanagerService.editSystemmanager({ ...systemmanager, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Gestión Admisión. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSystemmanager(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Gestión Admisión fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteSystemmanager(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Gestión Admisión: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.systemmanagerService.deleteSystemmanager(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Gestión Admisión. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSystemmanager(this.filters, 'id', 'desc', this.page, this.pageSize);
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
    this.getSystemmanager(this.filters, sort.active, sort.direction);
  }
}
