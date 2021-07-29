import { Component, ContentChild, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { PurchaseFactureService } from '../../services/purchase-facture.service';
import { PurchaseFacture } from '../../models/purchase-facture.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase-facture-form',
  templateUrl: './purchase-facture-form.component.html',
  styleUrls: ['./purchase-facture-form.component.scss'],
})
export class PurchaseFactureFormComponent implements OnInit, OnDestroy {
  @Input() purchaseFacture: PurchaseFacture;
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  purchaseFactureForm: FormGroup;
  estado: any = [];
  compra: any = [];
  operacion_comercial: any = [];
  comercial: any = [];
  subscriptions: Subscription[] = [];

  constructor(public purchaseFactureService: PurchaseFactureService,
    private toastrService: ToastrService,
     public dialogRef: MatDialogRef<PurchaseFactureFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEstado();
    this.getOperacion();
    this.getComercial();
    this.getCompra();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getEstado() {
    const sub = this.purchaseFactureService
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
    const sub = this.purchaseFactureService
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
    const sub = this.purchaseFactureService
      .getComercial()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.comercial = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getCompra() {
    const sub = this.purchaseFactureService
      .getCompra()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.compra = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const fechaEmision = this.data.purchaseFacture ? this.getFormattedDate(this.data.purchaseFacture.fecha_emision) : '';
    const fechaEntrega = this.data.purchaseFacture ? this.getFormattedDate(this.data.purchaseFacture.fecha_entrega) : '';
    this.purchaseFactureForm = new FormGroup({
      fecha_emision: new FormControl(fechaEmision, [Validators.required]),
      fecha_entrega: new FormControl(fechaEntrega, [Validators.required]),
      nro_factura: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.nro_factura : '', Validators.required),
      importe_total: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.importe_total : '', Validators.required),
      descuento: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.descuento : ''),
      arancel: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.arancel : ''),
      comentarios: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.comentarios : '', Validators.required),
      operacion_comercial: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.operacion_comercial_id : '', Validators.required),
      estado: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.estado_id : '', Validators.required),
      comercial: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.comercial_id : '', Validators.required),
      compra: new FormControl(this.data.purchaseFacture ? this.data.purchaseFacture.compra_id : '', Validators.required),
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
    return this.purchaseFactureForm?.get('comentarios') as FormControl;
  }

  get nrofacturaControl() {
    return this.purchaseFactureForm?.get('nro_factura') as FormControl;
  }

  get importeTotalControl() {
    return this.purchaseFactureForm?.get('importe_total') as FormControl;
  }

  get operacionControl() {
    return this.purchaseFactureForm?.get('operacion_comercial') as FormControl;
  }

  get estadoControl() {
    return this.purchaseFactureForm?.get('estado') as FormControl;
  }

  get comercialControl() {
    return this.purchaseFactureForm?.get('comercial') as FormControl;
  }

  get emisionControl() {
    return this.purchaseFactureForm?.get('fecha_emision') as FormControl;
  }

  get entregaControl() {
    return this.purchaseFactureForm?.get('fecha_entrega') as FormControl;
  }
  
  get compraControl() {
    return this.purchaseFactureForm?.get('compra') as FormControl;
  }
  sendData() {
    if (this.purchaseFactureForm.valid) {
      const purchaseFacture = this.purchaseFactureForm.value;
      const dateFormat = moment(purchaseFacture.fecha_emision);
      const dateFormat1 = moment(purchaseFacture.fecha_entrega);
      purchaseFacture.fecha_emision = dateFormat.format('yyyy-MM-DD');
      purchaseFacture.fecha_entrega = dateFormat1.format('yyyy-MM-DD');
      this.data.purchaseFacture ? this.edit.emit( purchaseFacture ) : this.create.emit( purchaseFacture );
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }

  onSubmit(data) {
    this.data.purchaseFacture ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
