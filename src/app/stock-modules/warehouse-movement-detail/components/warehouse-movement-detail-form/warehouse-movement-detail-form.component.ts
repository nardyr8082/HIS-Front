import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { WarehouseMovementDetailService } from '../../services/warehouse-movement-detail.service';
import { MeasureService } from 'src/app/stock-modules/classifiers/measure/services/measure.service';
import { WarehouseProductService } from 'src/app/stock-modules/warehouse-lot/services/warehouse-product.service';
import { ValidationWarehouse } from '../../validator/validator';
import { del } from 'selenium-webdriver/http';
import { MyValidation } from '../../../boxstock/validator/validator';

import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-warehouse-movement-detail-form',
  templateUrl: './warehouse-movement-detail-form.component.html',
  styleUrls: ['./warehouse-movement-detail-form.component.scss'],
})
export class WarehouseMovementDetailFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  measure: any = [];
  valueProd: any = null;
  valueMov: any = null;
  arrayInputs: any = [];
  amount = 0;
  notSubmit: boolean;
  myselect: boolean;
  warehouseProduct: any = [];
  move: any = [];
  warehouseMovementDetails: any[];
  WarehouseMovementDetailForm: FormGroup;
  subscriptions: Subscription[] = [];
  constructor(
    public fb: FormBuilder,
    private toastService: ToastrService,
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
  myChangePro(event) {
    console.log('evento', event.value);
    this.valueProd = event.value;
    this.myselect = true;
    this.disabledSubmit();
  }
  myChangeMov(event) {
    console.log('evento', event.value);
    this.valueMov = event.value;
    this.myselect = true;
    this.disabledSubmit();
  }
  disabledSubmit() {
    console.log('disabled submit');
    console.log('disable MOV', this.valueMov);
    console.log('disable PRO', this.valueProd);
    let id = null;
    //put, post espera un evento
    if (this.valueMov === null && this.valueProd === null) {
      console.log('OK 1');
      if (this.data?.warehouseMovementDetail !== null) {
        console.log('OK 2');
        this.valueMov = this.WarehouseMovementDetailForm.get('movimiento').value;
        this.valueProd = this.WarehouseMovementDetailForm.get('producto').value;
        id = this.WarehouseMovementDetailForm.get('id').value;
      } else {
        console.log('OK 3');
        this.notSubmit = false;
      }
    }
    //put onselect, post es cuano se selecciono 2 enevto
    if (this.valueMov !== null && this.valueProd !== null) {
      console.log('OK 4');
      if (this.data?.warehouseMovementDetail !== null) id = this.data?.warehouseMovementDetail.id;
      this.warehouseMovementDetailService.checkMov(this.valueMov, this.valueProd, id).subscribe((res) => {
        console.log('OK 5', res.isAvailable);
        this.notSubmit = res.isAvailable;
        if (this.notSubmit) this.toastService.error('El conjunto de Producto y Movimiento ya existe.', 'Error');
      });
      console.log('El submit es final 0', this.notSubmit);
    }
    console.log('El submit es final 1', this.notSubmit);
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
    this.myselect = false;
    this.valueMov = null;
    this.valueProd = null;
    this.notSubmit = false;
    this.WarehouseMovementDetailForm = this.fb.group({
      id: new FormControl(this.data?.warehouseMovementDetail ? this.data?.warehouseMovementDetail.id : null),
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
      movimiento: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.movimiento_id : null, [Validators.required]),
      unidad_medida: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.unidad_medida_id : null, Validators.required),
    });
    console.log('buildForm DATA:', this.data?.warehouseMovementDetail);
    console.log('buildForm:', this.WarehouseMovementDetailForm);
    if (this.data?.warehouseMovementDetail !== null || this.data?.warehouseMovementDetail !== undefined) this.disabledSubmit();
    /*this.WarehouseMovementDetailForm.controls.producto.valueChanges
      .subscribe(
        x => this.WarehouseMovementDetailForm.controls.movimiento.updateValueAndValidity()
      );*/
  }

  /*checkConjuntMovProd: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pro = group.get('producto').value;
    let mov = group.get('movimiento').value;
    this.warehouseMovementDetailService.getWarehouseMovementDetailAux().subscribe( (res) => {
      this.arrayInputs = res.results;
    });
    this.arrayInputs = this.arrayInputs.filter((valores) => (valores.producto['id'] === pro && valores.movimiento['id'] === mov));
    if (this.arrayInputs.length >= 1 ) {
      return { isConjunt: true };
    }
    return null;
  }*/

  getShowAmount(event) {
    console.log('showamount: ', event);
    let counts = this.WarehouseMovementDetailForm.get('cantidad').value;
    let price = this.WarehouseMovementDetailForm.get('precio').value;
    console.log('form chequeo:', this.WarehouseMovementDetailForm);
    if (counts === null || price === null || counts < 0 || price < 0) {
      this.amount = 0;
    } else {
      if (this.WarehouseMovementDetailForm) {
        if (this.WarehouseMovementDetailForm.controls.cantidad.errors === null && this.WarehouseMovementDetailForm.controls.precio.errors === null)
          this.amount = counts * price;
        else this.amount = 0;
      }
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
