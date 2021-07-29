import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { ExistenceService } from '../../services/existence.service';
import { ProductCategory } from 'src/app/stock-modules/classifiers/product-category/models/product-category.model';
import { ProductCategoryService } from 'src/app/stock-modules/classifiers/product-category/services/product-category.service';
import { MeasureService } from 'src/app/stock-modules/classifiers/measure/services/measure.service';
import { StockService } from 'src/app/stock-modules/boxstock/services/stock.service';
import { WarehouseLotService } from 'src/app/stock-modules/warehouse-lot/services/warehouse-lot.service';
import { ValidationExistence } from '../../validator/validator';
@Component({
  selector: 'app-existence-form',
  templateUrl: './existence-form.component.html',
  styleUrls: ['./existence-form.component.scss']
})
export class ExistenceFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  productCategory: any = [];
  almacenes: any = [];
  unidad_medida: any = [];
  lote: any = [];

  existenceForm: FormGroup;

  subscriptions: Subscription[] = [];

  constructor(public existenceService: ExistenceService,
    private productCategoryService: ProductCategoryService,
    private measureService: MeasureService,
    private stockService: StockService,
    private warehouseLotService: WarehouseLotService,

    public dialogRef: MatDialogRef<ExistenceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.buildForm();
    this.getProductCategory();
    this.getMeasure();
    this.getStocks();
    this.getWarehouseLot();
  }
  ngOnDestroy() {
    this.subscriptions;
  }


  getProductCategory() {
    const sub = this.productCategoryService
      .getProductCategorys({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.productCategory = response.results;

        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getMeasure() {
    const sub = this.measureService
      .getMeasures({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.unidad_medida = response.results;

        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  getStocks() {
    const sub = this.stockService
      .getStock({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.almacenes = response.results;

        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  getWarehouseLot() {
    const sub = this.warehouseLotService
      .getWarehouseLot({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.lote = response.results;

        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  };

  buildForm() {
    this.existenceForm = new FormGroup({
      cantidad: new FormControl(this.data.existence ? this.data.existence.cantidad : null, [Validators.required, ValidationExistence.isDecimalFijo154]),
      importe: new FormControl(this.data.existence ? this.data.existence.importe : null, [Validators.required, ValidationExistence.isDecimalFijo172]),
      almacen: new FormControl(this.data.existence ? this.data.existence.almacen_id : null, Validators.required),
      unidad_medida: new FormControl(this.data.existence ? this.data.existence.unidad_medida_id : null, Validators.required),
      categoria: new FormControl(this.data.existence ? this.data.existence.categoria_id : null, Validators.required),
      lote: new FormControl(this.data.existence ? this.data.existence.lote_id : null, Validators.required)

    });
  }
  get cantidadControl() {
    return this.existenceForm?.get('cantidad') as FormControl;
  }

  get importeControl() {
    return this.existenceForm?.get('importe') as FormControl;
  }

  get almacenControl() {
    return this.existenceForm?.get('almacen') as FormControl;
  }

  get unidad_medidaControl() {
    return this.existenceForm?.get('unidad_medida') as FormControl;
  }
  get categoriaControl() {
    return this.existenceForm?.get('categoria') as FormControl;
  }
  get loteControl() {
    return this.existenceForm?.get('lote') as FormControl;
  }

  onSubmit(data) {
    this.data.existence ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
