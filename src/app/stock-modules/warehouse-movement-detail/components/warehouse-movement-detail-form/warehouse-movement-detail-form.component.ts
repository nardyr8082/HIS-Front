import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { WarehouseMovementDetailService } from '../../services/warehouse-movement-detail.service';
import { MeasureService } from 'src/app/stock-modules/classifiers/measure/services/measure.service';
import { WarehouseProductService } from 'src/app/stock-modules/warehouse-lot/services/warehouse-product.service';
import { ValidationWarehouse } from '../../validator/validator';
import { del } from 'selenium-webdriver/http';
import { MyValidation } from '../../../boxstock/validator/validator';

@Component({
  selector: 'app-warehouse-movement-detail-form',
  templateUrl: './warehouse-movement-detail-form.component.html',
  styleUrls: ['./warehouse-movement-detail-form.component.scss'],
})
export class WarehouseMovementDetailFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  measure: any = [];
  amount = 0;
  warehouseProduct: any = [];
  move: any = [];
  warehouseMovementDetails: any[];
  WarehouseMovementDetailForm: FormGroup;
  subscriptions: Subscription[] = [];
  constructor(
    public fb: FormBuilder,
    public warehouseMovementDetailService: WarehouseMovementDetailService,
    private measureService: MeasureService,
    private warehouseProductService: WarehouseProductService,
    public dialogRef: MatDialogRef<WarehouseMovementDetailFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getMeasure();
    this.getWarehouseMove();
    this.getWarehouseProduct();
    this.getWarehouseMovementDetail();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getMeasure() {
    const sub = this.measureService
      .getMeasures({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.measure = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getWarehouseMove() {
    const sub = this.warehouseMovementDetailService
      .getMovement()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.move = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getWarehouseMovementDetail() {
    const sub = this.warehouseMovementDetailService
      .getWarehouseMovementDetail({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.warehouseMovementDetails = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getWarehouseProduct() {
    const sub = this.warehouseProductService
      .geWarehouseProduct({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.warehouseProduct = response.results;
        }),
      )
      .subscribe();
    console.log(this.move);
    this.subscriptions.push(sub);
  }

  buildForm() {
    console.log('buildForm:', this.data);
    //this.WarehouseMovementDetailForm = new FormGroup({
    this.WarehouseMovementDetailForm = this.fb.group({
      //cantidad: [(this.data.warehouseMovementDetail && this.data.warehouseMovementDetail.cantidad) ? this.data.warehouseMovementDetail.cantidad : '', [Validators.required, ValidationWarehouse.isDecimalFijo154]],
      //existencia: [(this.data.warehouseMovementDetail && this.data.warehouseMovementDetail.existencia) ? this.data.warehouseMovementDetail.existencia : '', ValidationWarehouse.isInts],
      //precio: [(this.data.warehouseMovementDetail && this.data.warehouseMovementDetail.precio) ? this.data.warehouseMovementDetail.precio : '', [Validators.required, ValidationWarehouse.isDecimalFijo172]],
      //producto: [(this.data.warehouseMovementDetail && this.data.warehouseMovementDetail.producto_id) ? this.data.warehouseMovementDetail.producto_id : '', [Validators.required]],
      //movimiento: [(this.data.warehouseMovementDetail && this.data.warehouseMovementDetail.movimiento_id) ? this.data.warehouseMovementDetail.movimiento_id : '', [Validators.required]],
      //unidad_medida: [(this.data.warehouseMovementDetail && this.data.warehouseMovementDetail.unidad_medida_id) ? this.data.warehouseMovementDetail.unidad_medida_id : '', [Validators.required]],
      cantidad: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.cantidad : null, [
        Validators.required,
        ValidationWarehouse.isDecimalFijo154,
      ]),
      existencia: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.existencia : null, ValidationWarehouse.isInts),
      precio: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.precio : null, [
        Validators.required,
        ValidationWarehouse.isDecimalFijo172,
      ]),
      producto: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.producto_id : null, Validators.required),
      movimiento: new FormControl(
        this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.movimiento_id : null,
        Validators.required,
        ValidationWarehouse.validateFieldMove(this.warehouseMovementDetailService, this.data.warehouseMovementDetail),
      ),
      unidad_medida: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.unidad_medida_id : null, Validators.required),
    });
    this.getShowAmount();
  }
  getShowAmount() {
    const counts = this.WarehouseMovementDetailForm.get('cantidad').value;
    const price = this.WarehouseMovementDetailForm.get('precio').value;
    if (counts === null || price === null) {
      this.amount = 0;
    } else {
      this.amount = counts * price;
    }
  }
  get cantidadControl() {
    return this.WarehouseMovementDetailForm?.get('cantidad') as FormControl;
  }
  get importControl() {
    return this.WarehouseMovementDetailForm?.get('importe') as FormControl;
  }
  get existControl() {
    return this.WarehouseMovementDetailForm?.get('existencia') as FormControl;
  }
  get precioControl() {
    return this.WarehouseMovementDetailForm?.get('precio') as FormControl;
  }
  get importeControl() {
    return this.WarehouseMovementDetailForm?.get('importe') as FormControl;
  }
  get existenciaControl() {
    return this.WarehouseMovementDetailForm?.get('existencia') as FormControl;
  }
  get productoControl() {
    return this.WarehouseMovementDetailForm?.get('producto') as FormControl;
  }
  get movimientoControl() {
    return this.WarehouseMovementDetailForm?.get('movimiento') as FormControl;
  }
  get unidad_medidaControl() {
    return this.WarehouseMovementDetailForm?.get('unidad_medida') as FormControl;
  }

  onSubmit(data) {
    console.log('ver data ya', data);
    console.log('ver ya', this.data);
    //data['precio'] = parseInt(data['precio']);
    //data['cantidad'] = parseInt(data['cantidad']);
    //data['importe'] = null;
    /*
       * {
    "cantidad": "3.0000",
    "precio": "3.00",
    "movimiento": 26,
    "producto": 6,
    "unidad_medida": 4
}*/ let valores = {};
    if (data['existencia'] !== null) valores['existencia'] = data['existencia'];

    valores['cantidad'] = data['cantidad'];
    valores['precio'] = data['precio'];
    valores['movimiento'] = data['movimiento'];
    valores['producto'] = data['producto'];
    valores['unidad_medida'] = data['unidad_medida'];
    console.log('ver valores ya', valores);
    if (data === valores) console.log('Son iguales');
    this.data.warehouseMovementDetail ? this.edit.emit(valores) : this.create.emit(valores);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
