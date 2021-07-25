import { MoveTypeService } from './../../../classifiers/move-type/services/moveType.service';
import { MoveStatusService } from './../../../classifiers/move-status/services/move-status.service';
import { StockService } from 'src/app/stock-modules/boxstock/services/stock.service';
import { MoveType } from './../../../classifiers/move-type/models/move-type.model';
import { MoveStatus } from './../../../classifiers/move-status/models/move-status.model';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from 'src/app/stock-modules/boxstock/models/boxstock.model';
import { User } from 'src/app/security-module/user/models/user.model';
import { UserService } from 'src/app/security-module/user/services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-warehouse-received-transfer-form',
  templateUrl: './warehouse-received-transfer-form.component.html',
  styleUrls: ['./warehouse-received-transfer-form.component.scss'],
})
export class WarehouseReceivedTransferFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  move: any = [];
  WarehouseReceivedTransferForm: FormGroup;
  subscriptions: Subscription[] = [];

  stocks: Stock[];
  statuses: MoveStatus[];
  moveTypes: MoveType[];
  users: User[];

  constructor(
    public dialogRef: MatDialogRef<WarehouseReceivedTransferFormComponent>,
    private stockService: StockService,
    private moveStatusService: MoveStatusService,
    private moveTypeService: MoveTypeService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getMoveTypes();
    this.getStocks();
    this.getStatueses();
    this.getUsers();
  }
  ngOnDestroy() {
    this.subscriptions;
  }

  buildForm() {
    const fecha = this.data?.warehouseReceivedTransfer ? this.getFormattedDate(this.data?.warehouseReceivedTransfer.fecha) : '';

    this.WarehouseReceivedTransferForm = new FormGroup({
      id: new FormControl(this.data?.warehouseReceivedTransfer?.id ? this.data?.warehouseReceivedTransfer?.id : null),
      fecha: new FormControl(fecha, [Validators.required]),
      numero: new FormControl(this.data?.warehouseReceivedTransfer?.numero ? this.data?.warehouseReceivedTransfer?.numero : null, [Validators.required]),
      comentario: new FormControl(this.data?.warehouseReceivedTransfer?.comentario ? this.data?.warehouseReceivedTransfer?.comentario : null, [
        Validators.required,
      ]),
      nro_control: new FormControl(this.data?.warehouseReceivedTransfer?.nro_control ? this.data?.warehouseReceivedTransfer?.nro_control : null, [
        Validators.required,
      ]),
      almacen: new FormControl(this.data?.warehouseReceivedTransfer?.almacen ? this.data?.warehouseReceivedTransfer?.almacen.id : null, [Validators.required]),
      estado: new FormControl(this.data?.warehouseReceivedTransfer?.estado ? this.data?.warehouseReceivedTransfer?.estado.id : null, [Validators.required]),
      tipo_de_movimiento: new FormControl(
        this.data?.warehouseReceivedTransfer?.tipo_de_movimiento ? this.data?.warehouseReceivedTransfer?.tipo_de_movimiento.id : null,
        [Validators.required],
      ),
      usuario: new FormControl(this.data?.warehouseReceivedTransfer?.usuario ? this.data?.warehouseReceivedTransfer?.usuario.id : null, [Validators.required]),
      transferencia_origen: new FormControl(
        this.data?.warehouseReceivedTransfer?.transferencia_origen ? this.data?.warehouseReceivedTransfer?.transferencia_origen.id : null,
        [Validators.required],
      ),
    });
  }

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }

  get fechaControl() {
    return this.WarehouseReceivedTransferForm.get('fecha') as FormControl;
  }

  get numeroControl() {
    return this.WarehouseReceivedTransferForm.get('numero') as FormControl;
  }

  get comentarioControl() {
    return this.WarehouseReceivedTransferForm.get('comentario') as FormControl;
  }

  get nro_controlControl() {
    return this.WarehouseReceivedTransferForm.get('nro_control') as FormControl;
  }

  get almacenControl() {
    return this.WarehouseReceivedTransferForm.get('almacen') as FormControl;
  }

  get estadoControl() {
    return this.WarehouseReceivedTransferForm.get('estado') as FormControl;
  }

  get tipo_de_movimientoControl() {
    return this.WarehouseReceivedTransferForm.get('tipo_de_movimiento') as FormControl;
  }

  get usuarioControl() {
    return this.WarehouseReceivedTransferForm.get('usuario') as FormControl;
  }

  onSubmit(data) {
    const dateFormat = moment(data.fecha);
    data.fecha = dateFormat.format('yyyy-MM-DD');
    this.edit.emit(data);
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
