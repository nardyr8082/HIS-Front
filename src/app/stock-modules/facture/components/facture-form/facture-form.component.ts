import { Component, ContentChild, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { FactureService } from '../../services/facture.service';
import { Facture } from '../../models/facture.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-facture-form',
  templateUrl: './facture-form.component.html',
  styleUrls: ['./facture-form.component.scss'],
})
export class FactureFormComponent implements OnInit, OnDestroy {
  @Input() facture: Facture;
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  factureForm: FormGroup;
  estado: any = [];
  operacion_comercial: any = [];
  comercial: any = [];
  subscriptions: Subscription[] = [];

  constructor(
    public factureService: FactureService,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<FactureFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEstado();
    this.getOperacion();
    this.getComercial();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getEstado() {
    const sub = this.factureService
      .getEstado()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.estado = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getOperacion() {
    const sub = this.factureService
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
    const sub = this.factureService
      .getComercial()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.comercial = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const fechaEmision = this.data.facture ? this.getFormattedDate(this.data.facture.fecha_emision) : '';
    const fechaEntrega = this.data.facture ? this.getFormattedDate(this.data.facture.fecha_entrega) : '';
    this.factureForm = new FormGroup({
      fecha_emision: new FormControl(fechaEmision, [Validators.required]),
      fecha_entrega: new FormControl(fechaEntrega, [Validators.required]),
      nro_factura: new FormControl(this.data.facture ? this.data.facture.nro_factura : '', Validators.required),
      importe_total: new FormControl(this.data.facture ? this.data.facture.importe_total : '', Validators.required),
      descuento: new FormControl(this.data.facture ? this.data.facture.descuento : ''),
      arancel: new FormControl(this.data.facture ? this.data.facture.arancel : ''),
      comentarios: new FormControl(this.data.facture ? this.data.facture.comentarios : '', Validators.required),
      operacion_comercial: new FormControl(this.data.facture ? this.data.facture.operacion_comercial_id : '', Validators.required),
      estado: new FormControl(this.data.facture ? this.data.facture.estado_id : '', Validators.required),
      comercial: new FormControl(this.data.facture ? this.data.facture.comercial_id : '', Validators.required),
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
    return this.factureForm?.get('comentarios') as FormControl;
  }

  get nrofacturaControl() {
    return this.factureForm?.get('nro_factura') as FormControl;
  }

  get importeTotalControl() {
    return this.factureForm?.get('importe_total') as FormControl;
  }

  get operacionControl() {
    return this.factureForm?.get('operacion_comercial') as FormControl;
  }

  get estadoControl() {
    return this.factureForm?.get('estado') as FormControl;
  }

  get comercialControl() {
    return this.factureForm?.get('comercial') as FormControl;
  }

  get emisionControl() {
    return this.factureForm?.get('fecha_emision') as FormControl;
  }

  get entregaControl() {
    return this.factureForm?.get('fecha_entrega') as FormControl;
  }

  sendData() {
    if (this.factureForm.valid) {
      const facture = this.factureForm.value;
      const dateFormat = moment(facture.fecha_emision);
      const dateFormat1 = moment(facture.fecha_entrega);
      facture.fecha_emision = dateFormat.format('yyyy-MM-DD');
      facture.fecha_entrega = dateFormat1.format('yyyy-MM-DD');
      this.data.facture ? this.edit.emit(facture) : this.create.emit(facture);
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }

  onSubmit(data) {
    this.data.facture ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
