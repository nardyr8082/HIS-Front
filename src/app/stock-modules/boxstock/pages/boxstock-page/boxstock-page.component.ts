import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Boxstock, Stock } from '../../models/boxstock.model';
import { Boxstock_TABLE_CONFIGURATION } from '../../models/boxstock-table-configuration';
import { BoxstockService } from '../../services/boxstock.service';
import { BoxstockFormComponent } from '../../components/boxstock-form/boxstock-form.component';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-boxstock-page',
  templateUrl: './boxstock-page.component.html',
  styleUrls: ['./boxstock-page.component.scss'],
})
export class BoxstockPageComponent implements OnInit {
  boxstock: Boxstock[];
  dataCount = 0;
  configuration = Boxstock_TABLE_CONFIGURATION;
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
      callback: (item) => this.deleteBoxstock(item),
    },
  ];

  constructor(private stockService: StockService, private boxstockService: BoxstockService, private toastService: ToastrService, public dialog: MatDialog) {
    this.putStock();
  }

  ngOnInit(): void {
    this.getBoxstock();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  putStock(filters = {}) {
    const sub = this.stockService
      .getStock(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getBoxstock(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.boxstockService
      .getBoxstock(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Boxstock>) => {
          this.boxstock = response.results.map((response) => {
            const stockString = this.getBoxstockString(response.almacen);
            return { ...response, almacen_string: stockString };
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
  getBoxstockString(stock: Stock) {
    return stock.nombre;
  }
  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getBoxstock(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getBoxstock(filters, 'id', 'desc');
  }

  createBoxstock() {
    let dialogRef: MatDialogRef<BoxstockFormComponent, any>;

    dialogRef = this.dialog.open(BoxstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        boxstock: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as BoxstockFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((boxstock: Boxstock) =>
          this.boxstockService.createBoxstock(boxstock).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Almacén Caja. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBoxstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacén Caja fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<BoxstockFormComponent, any>;

    dialogRef = this.dialog.open(BoxstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        boxstock: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as BoxstockFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((boxstock: Boxstock) =>
          this.boxstockService.editBoxstock({ ...boxstock, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Almacén Caja. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBoxstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacén Caja fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteBoxstock(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Almacén Caja: ${item.nro}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.boxstockService.deleteBoxstock(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Almacén Caja. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBoxstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacén Caja fue eliminado correctamente.', 'Felicidades');
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
    this.getBoxstock(this.filters, sort.active, sort.direction);
  }
}

