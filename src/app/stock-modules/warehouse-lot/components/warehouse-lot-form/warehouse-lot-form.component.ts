import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { WarehouseProductService } from '../../services/warehouse-product.service';
import { warehouseProduct } from '../../models/warehouseProduct';
import { WarehouseLotService } from '../../services/warehouse-lot.service';
import { WarehouseLot } from '../../models/warehouseLot';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-warehouse-lot-form',
  templateUrl: './warehouse-lot-form.component.html',
  styleUrls: ['./warehouse-lot-form.component.scss']
})
export class WarehouseLotFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  minDate: Date;
  maxDate: Date;
  warehouseProduct: any = [];
  warehouseLotForm: FormGroup;
  subscriptions: Subscription[] = [];
  warehouseLot: WarehouseLot[];

  constructor(public warehouseLotService: WarehouseLotService,
    private warehouseProductService: WarehouseProductService,
    public dialogRef: MatDialogRef<WarehouseLotFormComponent>,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.buildForm();
    this.getWarehouseProduct();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getWarehouseProduct() {
    const sub = this.warehouseProductService
      .geWarehouseProduct({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.warehouseProduct = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }



  buildForm() {
    const fechaFabricacion = this.data.warehouseLot ? this.getFormattedDate(this.data.warehouseLot.fecha_fabricacion) : '';
    const fechaVencimiento = this.data.warehouseLot ? this.getFormattedDate(this.data.warehouseLot.fecha_vencimiento) : '';
    this.warehouseLotForm = new FormGroup({
      codigo: new FormControl(this.data.warehouseLot ? this.data.warehouseLot.codigo : '', Validators.required),
      codigo_barra_venta: new FormControl(this.data.warehouseLot ? this.data.warehouseLot.codigo_barra_venta : '', Validators.required),
      precio_costo: new FormControl(this.data.warehouseLot ? this.data.warehouseLot.precio_costo : '', Validators.required),
      precio_venta: new FormControl(this.data.warehouseLot ? this.data.warehouseLot.precio_venta : '', Validators.required),
      fecha_fabricacion: new FormControl(fechaFabricacion, [Validators.required]),
      fecha_vencimiento: new FormControl(fechaVencimiento, [Validators.required]),
      retenido: new FormControl(this.data.warehouseLot ? this.data.warehouseLot.retenido : '', Validators.required),
      vencido: new FormControl(this.data.warehouseLot ? this.data.warehouseLot.vencido : '', Validators.required),
      producto: new FormControl(this.data.warehouseLot ? this.data.warehouseLot.producto : '', Validators.required),
    });
    console.log(this.warehouseLotForm);
  }


  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }

  get codigoControl() {
    return this.warehouseLotForm?.get('codigo') as FormControl;
  }

  get codigoBarraVentaControl() {
    return this.warehouseLotForm?.get('codigo_barra_venta') as FormControl;
  }

  get precioCostoControl() {
    return this.warehouseLotForm?.get('precio_costo') as FormControl;
  }

  get precioVentaControl() {
    return this.warehouseLotForm?.get('precio_venta') as FormControl;
  }

  get retenidoControl() {
    return this.warehouseLotForm?.get('retenido') as FormControl;
  }


  get vencidoControl() {
    return this.warehouseLotForm?.get('vencido') as FormControl;
  }

  get productoControl() {
    return this.warehouseLotForm?.get('producto') as FormControl;
  }

  sendData() {
    if (this.warehouseLotForm.valid) {
      console.log('llego')
      const warehouseLForm = this.warehouseLotForm.value;
      const dateFormat = moment(warehouseLForm.fecha_fabricacion);
      const dateFormat1 = moment(warehouseLForm.fecha_vencimiento);
      warehouseLForm.fecha_fabricacion = dateFormat.format('yyyy-MM-DD');
      warehouseLForm.fecha_vencimiento = dateFormat1.format('yyyy-MM-DD');
      console.log(warehouseLForm);
      this.data.warehouseLForm ? this.edit.emit(warehouseLForm) : this.create.emit(warehouseLForm);
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }


  onSubmit(data) {
    this.data.warehouseLot ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }



}
