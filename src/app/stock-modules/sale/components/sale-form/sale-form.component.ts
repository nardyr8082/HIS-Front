import { Component, ContentChild, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../models/sale.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss'],
})
export class SaleFormComponent implements OnInit, OnDestroy {
  @Input() sale: Sale;
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  saleForm: FormGroup;
  estado: any = [];
  almacen: any = [];
  usuario: any = [];
  tipo_movimiento: any = [];
  subscriptions: Subscription[] = [];

  constructor(public saleService: SaleService,
     private toastrService: ToastrService,
     public dialogRef: MatDialogRef<SaleFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEstado();
    this.getAlmacen();
    this.getUsuario();
    this.getTipo_Mov();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getEstado() {
    const sub = this.saleService
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
    const sub = this.saleService
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
    const sub = this.saleService
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
    const sub = this.saleService
      .getTipo_Mov()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.tipo_movimiento = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const fecha = this.data.sale ? this.getFormattedDate(this.data.sale.fecha) : '';
    this.saleForm = new FormGroup({
      fecha:  new FormControl(fecha, [Validators.required]),
      numero: new FormControl(this.data.sale ? this.data.sale.numero : '', Validators.required),
      nro_control: new FormControl(this.data.sale ? this.data.sale.nro_control : '', Validators.required),
      comentario: new FormControl(this.data.sale ? this.data.sale.comentario : '', Validators.required),
      almacen: new FormControl(this.data.sale ? this.data.sale.almacen_id : '', Validators.required),
      estado: new FormControl(this.data.sale ? this.data.sale.estado_id : '', Validators.required),
      usuario: new FormControl(this.data.sale ? this.data.sale.usuario_id : '', Validators.required),
      tipo_de_movimiento: new FormControl(this.data.sale ? this.data.sale.tipo_mov_id : '', Validators.required),
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
    return this.saleForm?.get('comentario') as FormControl;
  }

  get numeroControl() {
    return this.saleForm?.get('numero') as FormControl;
  }

  get estadoControl() {
    return this.saleForm?.get('estado') as FormControl;
  }

  get usuarioControl() {
    return this.saleForm?.get('usuario') as FormControl;
  }

  get fechaControl() {
    return this.saleForm?.get('fecha') as FormControl;
  }

  get nro_controlControl() {
    return this.saleForm?.get('nro_control') as FormControl;
  }

  get almacenControl() {
    return this.saleForm?.get('almacen') as FormControl;
  }

  get tipo_movControl() {
    return this.saleForm?.get('tipo_de_movimiento') as FormControl;
  }

  sendData() {
    if (this.saleForm.valid) {
      const sale = this.saleForm.value;
      const dateFormat = moment(sale.fecha);
      sale.fecha = dateFormat.format('yyyy-MM-DD');
      this.data.sale ? this.edit.emit( sale ) : this.create.emit( sale );
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }

  onSubmit(data) {
    this.data.sale ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
