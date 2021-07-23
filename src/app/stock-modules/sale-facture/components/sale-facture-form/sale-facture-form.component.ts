import { Component, ContentChild, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { SaleFactureService } from '../../services/sale-facture.service';
import { SaleFacture } from '../../models/sale-facture.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sale-facture-form',
  templateUrl: './sale-facture-form.component.html',
  styleUrls: ['./sale-facture-form.component.scss'],
})
export class SaleFactureFormComponent implements OnInit, OnDestroy {
  @Input() saleFacture: SaleFacture;
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  saleFactureForm: FormGroup;
  estado: any = [];
  venta: any = [];
  operacion_comercial: any = [];
  comercial: any = [];
  subscriptions: Subscription[] = [];

  constructor(public saleFactureService: SaleFactureService,
    private toastrService: ToastrService,
     public dialogRef: MatDialogRef<SaleFactureFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEstado();
    this.getOperacion();
    this.getComercial();
    this.getVenta();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getEstado() {
    const sub = this.saleFactureService
      .getEstado()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.estado = response.results;
          console.log(this.estado);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getOperacion() {
    const sub = this.saleFactureService
      .getOperacion()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.operacion_comercial = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getComercial() {
    const sub = this.saleFactureService
      .getComercial()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.comercial = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getVenta() {
    const sub = this.saleFactureService
      .getVenta()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.venta = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const fechaEmision = this.saleFacture ? this.getFormattedDate(this.saleFacture.fecha_emision) : '';
    const fechaEntrega = this.saleFacture ? this.getFormattedDate(this.saleFacture.fecha_entrega) : '';
    this.saleFactureForm = new FormGroup({
      fecha_emision: new FormControl(fechaEmision, [Validators.required]),
      fecha_entrega: new FormControl(fechaEntrega, [Validators.required]),
      nro_factura: new FormControl(this.data.saleFacture ? this.data.saleFacture.nro_factura : '', Validators.required),
      importe_total: new FormControl(this.data.saleFacture ? this.data.saleFacture.importe_total : '', Validators.required),
      descuento: new FormControl(this.data.saleFacture ? this.data.saleFacture.descuento : ''),
      arancel: new FormControl(this.data.saleFacture ? this.data.saleFacture.arancel : ''),
      comentarios: new FormControl(this.data.saleFacture ? this.data.saleFacture.comentarios : '', Validators.required),
      operacion_comercial: new FormControl(this.data.saleFacture ? this.data.saleFacture.operacion_comercial_id : '', Validators.required),
      estado: new FormControl(this.data.saleFacture ? this.data.saleFacture.estado_id : '', Validators.required),
      comercial: new FormControl(this.data.saleFacture ? this.data.saleFacture.comercial_id : '', Validators.required),
      venta: new FormControl(this.data.saleFacture ? this.data.saleFacture.venta_id : '', Validators.required),
    });
  }

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }

  formatedDate(date: string) {
    const dateArray = date.split('/');
    return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
  }

  get comentariosControl() {
    return this.saleFactureForm?.get('comentarios') as FormControl;
  }

  get nrofacturaControl() {
    return this.saleFactureForm?.get('nro_factura') as FormControl;
  }

  get importeTotalControl() {
    return this.saleFactureForm?.get('importe_total') as FormControl;
  }

  get operacionControl() {
    return this.saleFactureForm?.get('operacion_comercial') as FormControl;
  }

  get estadoControl() {
    return this.saleFactureForm?.get('estado') as FormControl;
  }

  get comercialControl() {
    return this.saleFactureForm?.get('comercial') as FormControl;
  }

  get emisionControl() {
    return this.saleFactureForm?.get('fecha_emision') as FormControl;
  }

  get entregaControl() {
    return this.saleFactureForm?.get('fecha_entrega') as FormControl;
  }
  
  get ventaControl() {
    return this.saleFactureForm?.get('venta') as FormControl;
  }
  sendData() {
    if (this.saleFactureForm.valid) {
      const saleFacture = this.saleFactureForm.value;
      const dateFormat = moment(saleFacture.fecha_emision);
      const dateFormat1 = moment(saleFacture.fecha_entrega);
      saleFacture.fecha_emision = dateFormat.format('yyyy-MM-DD');
      saleFacture.fecha_entrega = dateFormat1.format('yyyy-MM-DD');
      this.saleFacture ? this.edit.emit( saleFacture ) : this.create.emit( saleFacture );
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }

  onSubmit(data) {
    this.data.saleFacture ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
