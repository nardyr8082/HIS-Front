import { ConfirmationDialogFrontComponent } from './../../../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { MoveStatusService } from './../../../classifiers/move-status/services/move-status.service';
import { MoveTypeService } from './../../../classifiers/move-type/services/moveType.service';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { StockMoveService } from './../../services/stock-move.service';
import { ToastrService } from 'ngx-toastr';
import { StockService } from './../../../boxstock/services/stock.service';
import { STOCK_MOVE_TABLE_CONFIGURATION } from './../../models/stock-moves-table-configuration';
import { StockMove } from './../../models/stock-move.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { UserService } from 'src/app/security-module/user/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-stock-moves-page',
  templateUrl: './stock-moves-page.component.html',
  styleUrls: ['./stock-moves-page.component.scss'],
})
export class StockMovesPageComponent implements OnInit, OnDestroy {
  stockMoves: StockMove[];
  dataCount = 0;
  configuration = STOCK_MOVE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Confirmar Movimiento',
      icon: 'done',
      color: 'warm',
      class: 'btn-primary',
      callback: (item) => this.confirmMove(item),
    },
    {
      tooltipText: 'Editar Movimiento',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.goToItem(item),
    },
    {
      tooltipText: 'Eliminar Movimiento',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteStockMove(item),
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockMoveService: StockMoveService,
    private moveTypeService: MoveTypeService,
    private moveStatusService: MoveStatusService,
    private userService: UserService,
    private stockService: StockService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.putUsers();
    this.putStocks();
    this.putMoveType();
    this.putStatusMove();
  }

  ngOnInit(): void {
    this.getStockMoves();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  putUsers(filters = {}) {
    const sub = this.userService
      .getUsers(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: `${res.first_name} ${res.last_name}` }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putStatusMove() {
    const sub = this.moveStatusService
      .getMoveStatus({}, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putMoveType() {
    const sub = this.moveTypeService
      .getMoveTypes({}, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putStocks(filters = {}) {
    const sub = this.stockService
      .getStock(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[0].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getStockMoves(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.stockMoveService
      .getStockMove(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<StockMove>) => {
          this.stockMoves = response.results.map((res) => {
            const almacenString = res.almacen.nombre;
            const tipoMovimientoString = res.tipo_de_movimiento.descripcion;
            const estadoString =
              res.estado.descripcion.toLowerCase() == 'confirmado'
                ? `<p class="text-success">${res.estado.descripcion}</p>`
                : `<p class="text-danger">${res.estado.descripcion}</p>`;
            const userString = `${res.usuario?.first_name} ${res.usuario?.last_name}`;
            return {
              ...res,
              almacen_string: almacenString,
              tipo_de_movimiento_string: tipoMovimientoString,
              estado_string: estadoString,
              usuario_string: userString,
            };
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

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getStockMoves(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getStockMoves(filters, 'id', 'desc');
  }

  goToItem(item = null) {
    item ? this.router.navigate(['edit', item.id], { relativeTo: this.route }) : this.router.navigate(['create'], { relativeTo: this.route });
  }

  deleteStockMove(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Movimiento: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.stockMoveService.deleteStockMove(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Movimiento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStockMoves(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Movimiento fue eliminado correctamente.', 'Felicidades');
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
    this.getStockMoves(this.filters, sort.active, sort.direction);
  }

  confirmMove(item) {
    if (item?.estado.id == '1') {
      const stockMove = {
        ...item,
        almacen: item.almacen.id,
        tipo_de_movimiento: item.tipo_de_movimiento.id,
        usuario: item.usuario.id,
      };
      const modalRef = this.dialog.open(ConfirmationDialogFrontComponent, {
        data: {
          title: 'Confirmar Movimiento',
          question: '¿Está seguro que desea que desea confirmar el movimiento? Esta operación es irreversible.',
        },
      });

      const modalComponentRef = modalRef.componentInstance as ConfirmationDialogFrontComponent;

      const sub = modalComponentRef.accept
        .pipe(
          filter((accept) => accept),
          switchMap(() =>
            this.stockMoveService.createStockMove({ ...stockMove, estado: 2 }).pipe(
              map(() => {
                this.toastService.success('El movimiento ha sido confirmado correctamente', 'Felicidades');
                this.getStockMoves(this.filters, 'id', 'desc', this.page, this.pageSize);
              }),
            ),
          ),
        )
        .subscribe();

      this.subscriptions.push(sub);
    } else {
      this.toastService.info('Este movimiento ya se encuetra confirmado', 'Información');
    }
  }
}
