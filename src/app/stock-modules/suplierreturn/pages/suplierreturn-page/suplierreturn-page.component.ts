import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Suplierreturn_TABLE_CONFIGURATION } from '../../models/suplierreturn-table-configuration';
import { Suplierreturn } from '../../models/suplierreturn.model';
import { SuplierreturnService } from '../../services/suplierreturn.service';
import { StockService } from '../../../stock/services/stock.service';
import { Stock } from '../../../stock/models/stock.model';
import { SuplierreturnFormComponent } from '../../components/suplierreturn-form/suplierreturn-form.component';
import { User } from '../../../../security-module/user/models/user.model';
import { MoveType } from '../../../classifiers/move-type/models/move-type.model';
import { MoveStatus } from '../../../classifiers/move-status/models/move-status.model';
import { Provider } from '../../../classifiers/provider/models/provider.model';
import { ProviderService } from '../../../classifiers/provider/services/provider.service';
import { UserService } from '../../../../security-module/user/services/user.service';
import { MoveTypeService } from '../../../classifiers/move-type/services/moveType.service';
import { MoveStatusService } from '../../../classifiers/move-status/services/move-status.service';


@Component({
  selector: 'app-suplierreturn-page',
  templateUrl: './suplierreturn-page.component.html',
  styleUrls: ['./suplierreturn-page.component.scss'],
})
export class SuplierreturnPageComponent implements OnInit {
  suplierreturn: Suplierreturn[];
  dataCount = 0;
  configuration = Suplierreturn_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Devolución Proveedores',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Devolución Proveedores',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteSuplierreturn(item),
    },
  ];

  constructor(private providerService: ProviderService, private userService: UserService, private moveTypeService: MoveTypeService, private moveStatusService: MoveStatusService, private stockService: StockService, private suplierreturnService: SuplierreturnService, private toastService: ToastrService, public dialog: MatDialog) {
    this.putStock();
    this.putStatus();
    this.putProvider();
    this.putUser();
    this.putTypeMov();
  }

  ngOnInit(): void {
    this.getSuplierreturn();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  putStock(filters = {}) {
    const sub = this.stockService
      .getStock(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  putStatus(filters = {}) {
    const sub = this.moveStatusService
      .getMoveStatus(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  putTypeMov(filters = {}) {
    const sub = this.moveTypeService
      .getMoveTypes(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[6].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  putUser(filters = {}) {
    const sub = this.userService
      .getUsers(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[7].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putProvider(filters = {}) {
    const sub = this.providerService
      .getProviders(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[8].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getSuplierreturn(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.suplierreturnService
      .getSuplierreturn(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.suplierreturn = response.results.map((res) => {
            const stockString = this.getStockString(res.almacen);
            const statusString = this.getMoveStatusString(res.estado);
            const typeString = this.getMoveTypeString(res.tipo_de_movimiento);
            const userString = this.getUserString(res.usuario);
            const providerString = this.getProviderString(res.proveedor);
            return { ...res, almacen_string: stockString, estado_string: statusString, tipo_de_movimiento_string: typeString, usuario_string: userString, proveedor_string: providerString };
            //return { ...res };
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
  getStockString(stock: Stock) {
    return stock.nombre;
  }
  getUserString(user: User) {
    return user.username;
  }
  getMoveTypeString(movetype: MoveType) {
    return movetype.descripcion;
  }
  getMoveStatusString(movestatus: MoveStatus) {
    return movestatus.descripcion;
  }
  getProviderString(provider: Provider) {
    return provider.descripcion;
  }
  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getSuplierreturn(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getSuplierreturn(filters, 'id', 'desc');
  }

  createSuplierreturn() {
    let dialogRef: MatDialogRef<SuplierreturnFormComponent, any>;

    dialogRef = this.dialog.open(SuplierreturnFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        suplierreturn: null,
      },
      disableClose: true,
    });

    const modalComponentRef = dialogRef.componentInstance as SuplierreturnFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((suplierreturn: Suplierreturn) =>
          this.suplierreturnService.createSuplierreturn(suplierreturn).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Devolución Proveedores. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSuplierreturn(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Devolución Proveedores fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<SuplierreturnFormComponent, any>;

    dialogRef = this.dialog.open(SuplierreturnFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        suplierreturn: item,
      },
      disableClose: true,
    });

    const modalComponentRef = dialogRef.componentInstance as SuplierreturnFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((suplierreturn: Suplierreturn) =>
          this.suplierreturnService.editSuplierreturn({ ...suplierreturn, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Devolución Proveedores. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSuplierreturn(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Devolución Proveedores fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteSuplierreturn(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Devolución Proveedores: ${item.numero}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.suplierreturnService.deleteSuplierreturn(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Devolución Proveedores. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSuplierreturn(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Devolución Proveedores fue eliminado correctamente.', 'Felicidades');
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
    this.getSuplierreturn(this.filters, sort.active, sort.direction);
  }
}
