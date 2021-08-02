import { ConfirmationDialogFrontComponent } from './../../../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { StockMoveService } from './../../services/stock-move.service';
import { WarehouseMovementDetailService } from './../../../warehouse-movement-detail/services/warehouse-movement-detail.service';
import { AuthenticationService } from './../../../../core/services/authentication/authentication.service';
import { MoveType } from './../../../classifiers/move-type/models/move-type.model';
import { ProductCategory } from './../../../classifiers/product-category/models/product-category.model';
import { of, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StockMove } from './../../models/stock-move.model';
import { Component, Input, OnDestroy, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { User } from 'src/app/security-module/user/models/user.model';
import { Stock } from 'src/app/stock-modules/boxstock/models/boxstock.model';
import * as moment from 'moment';
import { WarehouseMovementDetail } from 'src/app/stock-modules/warehouse-movement-detail/models/warehouse-movement-detail.model';
import { map, catchError, filter, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-moves-form',
  templateUrl: './stock-moves-form.component.html',
  styleUrls: ['./stock-moves-form.component.scss'],
})
export class StockMovesFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() stockMove: StockMove;
  @Input() stocks: Stock[];
  @Input() categories: ProductCategory[];
  @Input() moveTypes: MoveType[];

  filteredMoveTypes: MoveType[] = [];

  user: User;

  subscriptions: Subscription[] = [];

  stockMoveForm: FormGroup;

  stockMovesDetails: WarehouseMovementDetail[] = [];

  constructor(
    private toastrService: ToastrService,
    private stockMoveService: StockMoveService,
    private authenticationService: AuthenticationService,
    private stockMoveDetailsService: WarehouseMovementDetailService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAuthUser();
  }

  ngOnChanges() {
    this.buildForm();
    if (this.stockMove) {
      this.getStockMovesDetails(this.stockMove.id);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getStockMovesDetails(stockMoveId) {
    const sub = this.stockMoveDetailsService
      .getWarehouseMovementDetail({ movimiento: stockMoveId }, 'id', 'asc', 1, 10)
      .pipe(
        map((response) => {
          this.stockMovesDetails = response.results;
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  buildForm() {
    const fecha = this.stockMove ? this.getFormattedDate(this.stockMove.fecha) : new Date();
    if (this.stockMove) {
      this.changeCategory(this.stockMove.tipo_de_movimiento.categoria as unknown as number);
    }

    this.stockMoveForm = new FormGroup({
      id: new FormControl(this.stockMove?.id ? this.stockMove?.id : null),
      fecha: new FormControl(fecha, [Validators.required]),
      numero: new FormControl(this.stockMove?.numero ? this.stockMove.numero : null, Validators.required),
      comentario: new FormControl(this.stockMove?.comentario ? this.stockMove.comentario : null, Validators.required),
      nro_control: new FormControl(this.stockMove?.nro_control ? this.stockMove.nro_control : null, Validators.required),
      almacen: new FormControl(this.stockMove?.almacen ? this.stockMove.almacen.id : null, Validators.required),
      categoria: new FormControl(this.stockMove?.tipo_de_movimiento?.categoria ? this.stockMove.tipo_de_movimiento.categoria : null, Validators.required),
      estado: new FormControl(this.stockMove?.estado ? this.stockMove.estado.id : 1, Validators.required),
      tipo_de_movimiento: new FormControl(this.stockMove?.tipo_de_movimiento ? this.stockMove.tipo_de_movimiento.id : null, Validators.required),
      usuario: new FormControl(this.stockMove?.usuario ? this.stockMove.usuario.id : this.user ? this.user.id : null, Validators.required),
    });
  }

  getAuthUser() {
    this.user = this.authenticationService.getUser();
  }

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }

  //#region Controls
  get fechaControl() {
    return this.stockMoveForm.get('fecha') as FormControl;
  }

  get numeroControl() {
    return this.stockMoveForm.get('numero') as FormControl;
  }

  get comentarioControl() {
    return this.stockMoveForm.get('comentario') as FormControl;
  }

  get nro_controlControl() {
    return this.stockMoveForm.get('nro_control') as FormControl;
  }

  get almacenControl() {
    return this.stockMoveForm.get('almacen') as FormControl;
  }

  get categoriaControl() {
    return this.stockMoveForm.get('categoria') as FormControl;
  }

  get estadoControl() {
    return this.stockMoveForm.get('estado') as FormControl;
  }

  get tipo_de_movimientoControl() {
    return this.stockMoveForm.get('tipo_de_movimiento') as FormControl;
  }

  get usuarioControl() {
    return this.stockMoveForm.get('usuario') as FormControl;
  }

  //#endregion

  changeCategory(categoryId: number) {
    this.filteredMoveTypes = this.moveTypes?.filter((mt) => mt.categoria.id == categoryId);
  }

  onSubmit(data) {
    const dateFormat = moment(data.fecha);
    data.fecha = dateFormat.format('yyyy-MM-DD');
    this.stockMove ? this.onEdit(data) : this.onCreate(data);
  }

  onCreate(data) {
    const sub = this.stockMoveService
      .createStockMove(data)
      .pipe(
        map((response) => {
          this.stockMove = response;
          this.toastrService.success('El movimiento se ha guardado correctamente');
        }),
        catchError(() => {
          this.toastrService.error('Hubo algún error guardadno el movimiento.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onEdit(data) {
    const sub = this.stockMoveService
      .editStockMove(data)
      .pipe(
        map((response) => {
          this.stockMove = response;
          this.toastrService.success('El movimiento se ha editado correctamente');
        }),
        catchError(() => {
          this.toastrService.error('Hubo algún error guardadno el movimiento.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onCreateStockMove() {
    if (this.stockMove) {
      this.getStockMovesDetails(this.stockMove.id);
    }
  }

  confirmMove() {
    if (this.stockMove?.estado.id == '1') {
      const stockMove = {
        ...this.stockMove,
        almacen: this.stockMove.almacen.id,
        tipo_de_movimiento: this.stockMove.tipo_de_movimiento.id,
        usuario: this.stockMove.usuario.id,
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
                this.router.navigate(['moves']);
                this.toastrService.success('El movimiento ha sido confirmado correctamente', 'Felicidades');
              }),
            ),
          ),
        )
        .subscribe();

      this.subscriptions.push(sub);
    } else {
      this.toastrService.info('Este movimiento ya se encuetra confirmado', 'Información');
    }
  }
}
