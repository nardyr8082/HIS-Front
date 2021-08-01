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
      fecha_fabricacion: new FormControl(fechaFabricacion, Validators.required),
      fecha_vencimiento: new FormControl(fechaVencimiento, Validators.required),
      retenido: new FormControl(this.data?.warehouseLot?.retenido==='Retenido' ? true : false),
      vencido: new FormControl(this.data?.warehouseLot?.vencido==='Vencido' ? true : false),
      producto: new FormControl(this.data.warehouseLot ? this.data.warehouseLot.producto_id : '', Validators.required),
    });
    
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

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }

  sendData() {
    if (this.warehouseLotForm.valid) {
      
      const warehouse = this.warehouseLotForm.value;
      const dateFormat = moment(warehouse.fecha_fabricacion);
      const dateFormat1 = moment(warehouse.fecha_vencimiento);
      warehouse.fecha_fabricacion = dateFormat.format('yyyy-MM-DD');
      warehouse.fecha_vencimiento = dateFormat1.format('yyyy-MM-DD');
      
      this.data.warehouseLForm ? this.edit.emit(warehouse) : this.create.emit(warehouse);
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }


  onSubmit(data) {
    

    let fechaFabricacion = data['fecha_fabricacion'].toString();
    let fechaVencimiento = data['fecha_vencimiento'].toString();
    let formateadaFabricacion = fechaFabricacion.split(' ');
    let formateadaVencimiento = fechaVencimiento.split(' ');

    if (this.data.warehouseLForm === null || formateadaFabricacion.length > 0 || formateadaVencimiento.length > 0) {
      const midateFab = formateadaFabricacion[3] + '-' + this.ChangesMonth(formateadaFabricacion[1]) + '-' + formateadaFabricacion[2];
      const midateVen = formateadaVencimiento[3] + '-' + this.ChangesMonth(formateadaVencimiento[1]) + '-' + formateadaVencimiento[2];
      data['fecha_fabricacion'] = midateFab;
      data['fecha_vencimiento'] = midateVen;
    }
    
    this.data.warehouseLot ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  ChangesMonth(mes: any) {
    
    if (mes === 'Jan') {
      return '01';
    }
    if (mes === 'Feb') {
      return '02';
    }
    if (mes === 'Mar') {
      return '03';
    }
    if (mes === 'Apr') {
      return '04';
    }
    if (mes === 'May') {
      return '05';
    }
    if (mes === 'Jun') {
      return '06';
    }
    if (mes === 'Jul') {
      return '07';
    }
    if (mes === 'Aug') {
      return '08';
    }
    if (mes === 'Sep') {
      return '09';
    }
    if (mes === 'Oct') {
      return '10';
    }
    if (mes === 'Nov') {
      return '11';
    }
    return 12;
  }



}
