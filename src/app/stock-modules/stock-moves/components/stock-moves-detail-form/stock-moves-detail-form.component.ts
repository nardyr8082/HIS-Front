import { MeasureService } from './../../../classifiers/measure/services/measure.service';
import { Measure } from './../../../classifiers/measure/models/measure.model';
import { WarehouseMovementDetailService } from './../../../warehouse-movement-detail/services/warehouse-movement-detail.service';
import { ToastrService } from 'ngx-toastr';
import { ProductstockService } from './../../../productstock/services/productstock.service';
import { ProductstockFormComponent } from './../../../productstock/components/productstock-form/productstock-form.component';
import { WarehouseProductService } from './../../../warehouse-lot/services/warehouse-product.service';
import { WarehouseMovementDetail } from './../../../warehouse-movement-detail/models/warehouse-movement-detail.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { StockMove } from '../../models/stock-move.model';
import { warehouseProduct } from 'src/app/stock-modules/warehouse-lot/models/warehouseProduct';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Productstock } from 'src/app/stock-modules/productstock/models/productstock.model';

@Component({
  selector: 'app-stock-moves-detail-form',
  templateUrl: './stock-moves-detail-form.component.html',
  styleUrls: ['./stock-moves-detail-form.component.scss'],
})
export class StockMovesDetailFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() stockMove: StockMove;
  @Input() stockDetailMove: WarehouseMovementDetail;

  @Output() create: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[] = [];

  stockDetailMoveForm: FormGroup;

  products: warehouseProduct[];
  measures: Measure[];

  constructor(
    private productService: WarehouseProductService,
    private dialog: MatDialog,
    private productstockService: ProductstockService,
    private MeasureService: MeasureService,
    private toastService: ToastrService,
    private movesDetailService: WarehouseMovementDetailService,
  ) {}

  ngOnChanges() {
    this.buildForm();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getMeasures();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getProducts() {
    const sub = this.productService
      .geWarehouseProduct({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.products = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getMeasures() {
    const sub = this.MeasureService.getMeasures({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.measures = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    if (this.stockMove) {
      this.stockDetailMoveForm = new FormGroup({
        cantidad: new FormControl(this.stockDetailMove ? this.stockDetailMove.cantidad : null, [Validators.required]),
        existencia: new FormControl(this.stockDetailMove ? this.stockDetailMove.existencia : null, [Validators.required]),
        precio: new FormControl(this.stockDetailMove ? this.stockDetailMove.precio : null, [Validators.required]),
        producto: new FormControl(this.stockDetailMove ? this.stockDetailMove.producto.id : null, Validators.required),
        movimiento: new FormControl(this.stockDetailMove ? this.stockDetailMove.movimiento.id : this.stockMove.id, Validators.required),
        unidad_medida: new FormControl(this.stockDetailMove ? this.stockDetailMove.unidad_medida.id : null, Validators.required),
      });
    }
  }

  get cantidadControl() {
    return this.stockDetailMoveForm?.get('cantidad') as FormControl;
  }
  get importControl() {
    return this.stockDetailMoveForm?.get('importe') as FormControl;
  }
  get existControl() {
    return this.stockDetailMoveForm?.get('existencia') as FormControl;
  }
  get precioControl() {
    return this.stockDetailMoveForm?.get('precio') as FormControl;
  }
  get importeControl() {
    return this.stockDetailMoveForm?.get('importe') as FormControl;
  }
  get existenciaControl() {
    return this.stockDetailMoveForm?.get('existencia') as FormControl;
  }
  get productoControl() {
    return this.stockDetailMoveForm?.get('producto') as FormControl;
  }
  get movimientoControl() {
    return this.stockDetailMoveForm?.get('movimiento') as FormControl;
  }
  get unidad_medidaControl() {
    return this.stockDetailMoveForm?.get('unidad_medida') as FormControl;
  }

  createProductstock() {
    let dialogRef: MatDialogRef<ProductstockFormComponent, any>;

    dialogRef = this.dialog.open(ProductstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        productstock: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProductstockFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((productstock: Productstock) =>
          this.productstockService.createProductstock(productstock).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProducts();
                this.toastService.success('El producto fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  saveMoveDetail(data) {
    const sub = this.movesDetailService
      .createWarehouseMovementDetail(data)
      .pipe(
        map(() => {
          this.toastService.success('El Detalle Movimiento fue creado correctamente.', 'Felicidades');
          this.buildForm();
          this.create.emit(null);
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al crear el Detalle Movimiento. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }
}
