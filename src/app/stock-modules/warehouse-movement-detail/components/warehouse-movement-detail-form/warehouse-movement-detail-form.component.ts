import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { WarehouseMovementDetailService } from '../../services/warehouse-movement-detail.service';
import { MeasureService } from 'src/app/stock-modules/classifiers/measure/services/measure.service';
import { WarehouseProductService } from 'src/app/stock-modules/warehouse-lot/services/warehouse-product.service';


@Component({
  selector: 'app-warehouse-movement-detail-form',
  templateUrl: './warehouse-movement-detail-form.component.html',
  styleUrls: ['./warehouse-movement-detail-form.component.scss']
})
export class WarehouseMovementDetailFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  measure: any = [];
  warehouseProduct: any = [];
  move: any = [];
  WarehouseMovementDetailForm: FormGroup;
  subscriptions: Subscription[] = [];
  constructor(
    public warehouseMovementDetailService: WarehouseMovementDetailService,
    private measureService: MeasureService,
    private warehouseProductService: WarehouseProductService,
    public dialogRef: MatDialogRef<WarehouseMovementDetailFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.buildForm();
    this.getMeasure();
    this.getWarehouseMove();
    this.getWarehouseProduct();

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
    this.WarehouseMovementDetailForm = new FormGroup({
      cantidad: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.cantidad : ''),
      precio: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.precio : ''),
      importe: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.importe : ''),
      existencia: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.existencia : '', [Validators.required, Validators.pattern('^[0-9]+([,][0-9]+)?$')]),
      producto: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.producto : '', Validators.required),
      movimiento: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.movimiento : '', Validators.required),
      unidad_medida: new FormControl(this.data.warehouseMovementDetail ? this.data.warehouseMovementDetail.unidad_medida : '', Validators.required),
    });
  }

  get cantidadControl() {
    return this.WarehouseMovementDetailForm?.get('cantidad') as FormControl;
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
    this.data.warehouseMovementDetail ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
