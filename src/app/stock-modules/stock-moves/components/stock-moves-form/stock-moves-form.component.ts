import { WarehouseMovementDetailService } from './../../../warehouse-movement-detail/services/warehouse-movement-detail.service';
import { AuthenticationService } from './../../../../core/services/authentication/authentication.service';
import { MoveType } from './../../../classifiers/move-type/models/move-type.model';
import { ProductCategory } from './../../../classifiers/product-category/models/product-category.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StockMove } from './../../models/stock-move.model';
import { Component, Input, OnDestroy, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { User } from 'src/app/security-module/user/models/user.model';
import { Stock } from 'src/app/stock-modules/boxstock/models/boxstock.model';
import * as moment from 'moment';
import { WarehouseMovementDetail } from 'src/app/stock-modules/warehouse-movement-detail/models/warehouse-movement-detail.model';
import { map } from 'rxjs/operators';

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

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  user: User;

  subscriptions: Subscription[] = [];

  stockMoveForm: FormGroup;

  stockMovesDetails: WarehouseMovementDetail[] = [];

  constructor(private authenticationService: AuthenticationService, private stockMoveDetailsService: WarehouseMovementDetailService) {}

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
    this.filteredMoveTypes = this.moveTypes.filter((mt) => mt.categoria.id == categoryId);
  }

  onSubmit(data) {
    const dateFormat = moment(data.fecha);
    data.fecha = dateFormat.format('yyyy-MM-DD');
    this.stockMove ? this.edit.emit(data) : this.create.emit(data);
  }

  onCreateStockMove() {
    if (this.stockMove) {
      this.getStockMovesDetails(this.stockMove.id);
    }
  }
}
