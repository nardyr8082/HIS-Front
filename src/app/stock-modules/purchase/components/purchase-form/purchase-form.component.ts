import { Component, ContentChild, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { PurchaseService } from '../../services/purchase.service';
import { Purchase } from '../../models/purchase.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
})
export class PurchaseFormComponent implements OnInit, OnDestroy {
  @Input() purchase: Purchase;
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  purchaseForm: FormGroup;
  estado: any = [];
  almacen: any = [];
  usuario: any = [];
  proveedor: any = [];
  tipo_movimiento: any = [];
  subscriptions: Subscription[] = [];

  constructor(public purchaseService: PurchaseService,
     private toastrService: ToastrService,
     public dialogRef: MatDialogRef<PurchaseFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEstado();
    this.getAlmacen();
    this.getUsuario();
    this.getTipo_Mov();
    this.getProveedor();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getEstado() {
    const sub = this.purchaseService
      .getEstado()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.estado = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getAlmacen() {
    const sub = this.purchaseService
      .getAlmacen()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.almacen = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getUsuario() {
    const sub = this.purchaseService
      .getUsuario()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.usuario = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getTipo_Mov() {
    const sub = this.purchaseService
      .getTipo_Mov()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.tipo_movimiento = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getProveedor() {
    const sub = this.purchaseService
      .getProveedor()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.proveedor = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const fecha = this.data.purchase ? this.getFormattedDate(this.data.purchase.fecha) : '';
    this.purchaseForm = new FormGroup({
      fecha:  new FormControl(fecha, [Validators.required]),
      numero: new FormControl(this.data.purchase ? this.data.purchase.numero : '', Validators.required),
      nro_control: new FormControl(this.data.purchase ? this.data.purchase.nro_control : '', Validators.required),
      comentario: new FormControl(this.data.purchase ? this.data.purchase.comentario : '', Validators.required),
      almacen: new FormControl(this.data.purchase ? this.data.purchase.almacen_id : '', Validators.required),
      estado: new FormControl(this.data.purchase ? this.data.purchase.estado_id : '', Validators.required),
      usuario: new FormControl(this.data.purchase ? this.data.purchase.usuario_id : '', Validators.required),
      tipo_de_movimiento: new FormControl(this.data.purchase ? this.data.purchase.tipo_mov_id : '', Validators.required),
      proveedor: new FormControl(this.data.purchase ? this.data.purchase.proveedor_id : '', Validators.required),
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

  get comentarioControl() {
    return this.purchaseForm?.get('comentario') as FormControl;
  }

  get numeroControl() {
    return this.purchaseForm?.get('numero') as FormControl;
  }

  get estadoControl() {
    return this.purchaseForm?.get('estado') as FormControl;
  }

  get usuarioControl() {
    return this.purchaseForm?.get('usuario') as FormControl;
  }

  get fechaControl() {
    return this.purchaseForm?.get('fecha') as FormControl;
  }

  get nro_controlControl() {
    return this.purchaseForm?.get('nro_control') as FormControl;
  }

  get almacenControl() {
    return this.purchaseForm?.get('almacen') as FormControl;
  }

  get tipo_movControl() {
    return this.purchaseForm?.get('tipo_de_movimiento') as FormControl;
  }

  get proveedorControl() {
    return this.purchaseForm?.get('proveedor') as FormControl;
  }

  sendData() {
    if (this.purchaseForm.valid) {
      const purchase = this.purchaseForm.value;
      const dateFormat = moment(purchase.fecha);
      purchase.fecha = dateFormat.format('yyyy-MM-DD');
      this.data.purchase ? this.edit.emit( purchase ) : this.create.emit( purchase );
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }

  onSubmit(data) {
    this.data.purchase ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
