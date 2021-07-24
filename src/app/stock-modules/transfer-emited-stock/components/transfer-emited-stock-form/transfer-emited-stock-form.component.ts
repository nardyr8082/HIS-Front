import { StockService } from './../../../stock/services/stock.service';
import { MoveTypeService } from './../../../classifiers/move-type/services/moveType.service';
import { MoveStatusService } from './../../../classifiers/move-status/services/move-status.service';
import { MoveType } from './../../../classifiers/move-type/models/move-type.model';
import { MoveStatus } from './../../../classifiers/move-status/models/move-status.model';
import { WarehouseMovementDetailService } from './../../../warehouse-movement-detail/services/warehouse-movement-detail.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WarehouseMove } from './../../../warehouse-movement-detail/models/warehouse-move.model';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stock } from '../../../stock/models/stock.model';
import { User } from '../../../../security-module/user/models/user.model';
import { UserService } from '../../../../security-module/user/services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tranfer-emited-stock-form',
  templateUrl: './transfer-emited-stock-form.component.html',
  styleUrls: ['./transfer-emited-stock-form.component.scss'],
})
export class TranferEmitedStockFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  moves: WarehouseMove[];

  subscriptions: Subscription[] = [];

  tranferEmitedForm: FormGroup;

  stocks: Stock[];
  statuses: MoveStatus[];
  moveTypes: MoveType[];
  users: User[];

  constructor(
    public dialogRef: MatDialogRef<TranferEmitedStockFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService,
    private moveStatusService: MoveStatusService,
    private moveTypeService: MoveTypeService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getMoveTypes();
    this.getStocks();
    this.getStatueses();
    this.getUsers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    const fecha = this.data?.transferEmited ? this.getFormattedDate(this.data?.transferEmited.fecha) : '';

    this.tranferEmitedForm = new FormGroup({
      id: new FormControl(this.data?.transferEmited?.id ? this.data?.transferEmited?.id : null),
      fecha: new FormControl(fecha, [Validators.required]),
      numero: new FormControl(this.data?.transferEmited?.numero ? this.data?.transferEmited?.numero : null, [Validators.required]),
      comentario: new FormControl(this.data?.transferEmited?.comentario ? this.data?.transferEmited?.comentario : null, [Validators.required]),
      nro_control: new FormControl(this.data?.transferEmited?.nro_control ? this.data?.transferEmited?.nro_control : null, [Validators.required]),
      almacen: new FormControl(this.data?.transferEmited?.almacen ? this.data?.transferEmited?.almacen.id : null, [Validators.required]),
      estado: new FormControl(this.data?.transferEmited?.estado ? this.data?.transferEmited?.estado.id : null, [Validators.required]),
      tipo_de_movimiento: new FormControl(this.data?.transferEmited?.tipo_de_movimiento ? this.data?.transferEmited?.tipo_de_movimiento.id : null, [
        Validators.required,
      ]),
      usuario: new FormControl(this.data?.transferEmited?.usuario ? this.data?.transferEmited?.usuario.id : null, [Validators.required]),
      almacen_destino: new FormControl(this.data?.transferEmited?.almacen_destino ? this.data?.transferEmited?.almacen_destino.id : null, [
        Validators.required,
      ]),
    });
  }

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }

  get fechaControl() {
    return this.tranferEmitedForm.get('fecha') as FormControl;
  }

  get numeroControl() {
    return this.tranferEmitedForm.get('numero') as FormControl;
  }

  get comentarioControl() {
    return this.tranferEmitedForm.get('comentario') as FormControl;
  }

  get nro_controlControl() {
    return this.tranferEmitedForm.get('nro_control') as FormControl;
  }

  get almacenControl() {
    return this.tranferEmitedForm.get('almacen') as FormControl;
  }

  get estadoControl() {
    return this.tranferEmitedForm.get('estado') as FormControl;
  }

  get tipo_de_movimientoControl() {
    return this.tranferEmitedForm.get('tipo_de_movimiento') as FormControl;
  }

  get usuarioControl() {
    return this.tranferEmitedForm.get('usuario') as FormControl;
  }

  get almacen_destinoControl() {
    return this.tranferEmitedForm.get('almacen_destino') as FormControl;
  }

  onSubmit(data) {
    const dateFormat = moment(data.fecha);
    data.fecha = dateFormat.format('yyyy-MM-DD');
    this.data?.transferEmited ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  getMoveTypes() {
    const sub = this.moveTypeService
      .getMoveTypes({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.moveTypes = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getStocks() {
    const sub = this.stockService
      .getStock({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.stocks = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getStatueses() {
    const sub = this.moveStatusService
      .getMoveStatus({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.statuses = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getUsers() {
    const sub = this.userService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.users = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
