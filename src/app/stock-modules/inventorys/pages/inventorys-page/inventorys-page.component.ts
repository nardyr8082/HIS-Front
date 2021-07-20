import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { InventorysService } from '../../services/inventorys.service';
import { Inventorys } from '../../models/inventorys.model';
import { Inventorys_TABLE_CONFIGURATION } from '../../models/inventorys-table-configuration';
import { InventorysFormComponent } from '../../components/inventorys-form/inventorys-form.component';

@Component({
  selector: 'app-inventorys-page',
  templateUrl: './inventorys-page.component.html',
  styleUrls: ['./inventorys-page.component.scss'],
})
export class InventorysPageComponent implements OnInit, OnDestroy {
  inventorys: Inventorys[];
  dataCount = 0;
  configuration = Inventorys_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Inventario',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Inventario',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteInventorys(item),
    },
  ];

  constructor(
    private inventorysService: InventorysService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getStock();
    this.getUser();
    this.getStatus();
  }

  ngOnInit(): void {
    this.getInventorys();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getUser(filters = {}) {
    const sub = this.inventorysService
      .getUser()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getStock(filters = {}) {
    const sub = this.inventorysService
      .getStock()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getStatus(filters = {}) {
    const sub = this.inventorysService
      .getStatus()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  getInventorys(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.inventorysService
      .getInventorys(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.inventorys = response.results.map((res) => ({
            ...res,
            estado_desc: res.estado.descripcion,
            estado_id: res.estado.id,
            usuario_username: res.usuario.username,
            usuario_id: res.usuario.id,
            almacen_descripcion: res.almacen.nombre,
            almacen_id: res.almacen.id
          }));
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
    this.getInventorys(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getInventorys(filters, 'id', 'desc');
  }

  createInventorys() {
    let dialogRef: MatDialogRef<InventorysFormComponent, any>;

    dialogRef = this.dialog.open(InventorysFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        inventorys: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as InventorysFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((inventorys: Inventorys) =>
          this.inventorysService.createInventorys(inventorys).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Inventario fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<InventorysFormComponent, any>;

    dialogRef = this.dialog.open(InventorysFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        inventorys: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as InventorysFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((inventorys: Inventorys) =>
          this.inventorysService.editInventorys({ ...inventorys, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el conteo de inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Inventario fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteInventorys(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Inventario?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.inventorysService.deleteInventorys(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Inventario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getInventorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Inventario fue eliminado correctamente.', 'Felicidades');
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
    this.getInventorys(this.filters, sort.active, sort.direction);
  }
}
