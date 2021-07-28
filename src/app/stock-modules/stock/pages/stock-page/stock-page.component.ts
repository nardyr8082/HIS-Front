import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Stock } from '../../models/stock.model';
import { StockFormComponent } from '../../components/stock-form/stock-form.component';
import { StockService } from '../../services/stock.service';
import { Stock_TABLE_CONFIGURATION } from '../../models/stock-table-configuration';
import { UserService } from '../../../../security-module/user/services/user.service';
import { User } from '../../../../security-module/user/models/user.model';
import { OfficeService } from '../../../../structure-modules/office/services/office.service';
import { Office } from '../../../../structure-modules/office/models/office.model';


@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss'],
})
export class StockPageComponent implements OnInit {
  stock: Stock[];
  dataCount = 0;
  configuration = Stock_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Almacén',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Almacén',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteStock(item),
    },
  ];

  constructor(private officeService: OfficeService, private userService: UserService, private stockService: StockService, private toastService: ToastrService, public dialog: MatDialog) {
    this.putUser();
    this.putOffice();
  }

  ngOnInit(): void {
    this.getStock();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  putUser(filters = {}) {
    const sub = this.userService
      .getUsers(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putOffice(filters = {}) {
    const sub = this.officeService
      .getOffice(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[6].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }



  getStock(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.stockService
      .getStock(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Stock>) => {
          this.stock = response.results.map((res) => {
            const userString = this.getUserString(res.jefe_almacen);
            const departamentoString = this.getOfficeString(res.departamento);
            const activo = res.activo ? '<p class="text-success">Si</p>' : '<p class="text-danger">No</p>';
            const punto_de_venta = res.punto_de_venta ? '<p class="text-success">Si</p>' : '<p class="text-danger">No</p>';
            return { ...res, activo_string: activo, punto_de_venta_string: punto_de_venta, jefe_almacen_string: userString, departamento_string: departamentoString};
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
  getUserString(user: User) {
    return user.username;
  }
  getActiveString(active: boolean) {
    if (active === true)
      return '<p class="text-success">Si</p>';
    return '<p class="text-danger">No</p>';
  }
  getSalePointString(point: boolean) {
    if (point === true){
      console.log('OKIS');
      return '<p class="text-success">Si</p>';
    }
    console.log('NOP');
    return '<p class="text-danger">No</p>';
  }
  getOfficeString(office: Office) {
    return office.nombre;
  }
  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getStock(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getStock(filters, 'id', 'desc');
  }

  createStock() {
    let dialogRef: MatDialogRef<StockFormComponent, any>;

    dialogRef = this.dialog.open(StockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        stock: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as StockFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((stock: Stock) =>
          this.stockService.createStock(stock).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Almacén. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacén fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<StockFormComponent, any>;

    dialogRef = this.dialog.open(StockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        stock: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as StockFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((stock: Stock) =>
          this.stockService.editStock({ ...stock, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Almacén. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacén fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteStock(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Almacén: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.stockService.deleteStock(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Almacén. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacén fue eliminado correctamente.', 'Felicidades');
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
    this.getStock(this.filters, sort.active, sort.direction);
  }
}

