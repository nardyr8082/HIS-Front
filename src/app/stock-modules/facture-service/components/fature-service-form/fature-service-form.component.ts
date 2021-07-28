import { ServicesstockService } from './../../../servicesstock/services/servicesstock.service';
import { FactureService } from './../../../facture/services/facture.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Servicesstock } from './../../../servicesstock/models/servicesstock.model';
import { Facture } from './../../../facture/models/facture.model';
import { StockService } from './../../../boxstock/services/stock.service';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fature-service-form',
  templateUrl: './fature-service-form.component.html',
  styleUrls: ['./fature-service-form.component.scss'],
})
export class FactureServiceFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  services: Servicesstock[];
  factures: Facture[];
  estado: any = [];
  operacion_comercial: any = [];
  comercial: any = [];

  subscriptions: Subscription[] = [];

  factureServiceForm: FormGroup;

  constructor(
    private factureService: FactureService,
    private stockService: ServicesstockService,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<FactureServiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getServices();
    this.getEstado();
    this.getComercial();
    this.getOperacion();

  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getServices() {
    const sub = this.stockService
      .getServicesstock({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.services = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

    getEstado() {
    const sub = this.factureService
      .getEstado()
      .pipe(
        map((response) => {
          this.estado = response.results;
          console.log(this.estado);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getOperacion() {
    const sub = this.factureService
      .getOperacion()
      .pipe(
        map((response) => {
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
        map((response) => {
          this.comercial = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  buildForm() {
     const fechaEmision = this.data.factureService ? this.getFormattedDate(this.data.factureService.fecha_emision) : '';
      const fechaEntrega = this.data.factureService ? this.getFormattedDate(this.data.factureService.fecha_entrega) : '';
      this.factureServiceForm = new FormGroup({
        fecha_emision: new FormControl(fechaEmision, [Validators.required]),
        fecha_entrega: new FormControl(fechaEntrega, [Validators.required]),
        nro_factura: new FormControl(this.data.factureService ? this.data.factureService.nro_factura : '', Validators.required),
        importe_total: new FormControl(this.data.factureService ? this.data.factureService.importe_total : '', Validators.required),
        cantidad: new FormControl(this.data.factureService ? this.data.factureService.cantidad : '', Validators.required),
        descuento: new FormControl(this.data.factureService ? this.data.factureService.descuento : ''),
        arancel: new FormControl(this.data.factureService ? this.data.factureService.arancel : ''),
        comentarios: new FormControl(this.data.factureService ? this.data.factureService.comentarios : '', Validators.required),
        operacion_comercial: new FormControl(this.data.factureService ? this.data.factureService.operacion_comercial_id : null, Validators.required),
        estado: new FormControl(this.data.factureService ? this.data.factureService.estado_id : null, Validators.required),
        comercial: new FormControl(this.data.factureService ? this.data.factureService.comercial_id : null, Validators.required),
        servicio: new FormControl(this.data?.factureService?.servicio ? this.data?.factureService.servicio.id : null, [Validators.required]),
      });
  }

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }

  get idControl() {
    return this.factureServiceForm.get('id') as FormControl;
  }

  get cantidadControl() {
    return this.factureServiceForm.get('cantidad') as FormControl;
  }

  get comentariosControl() {
    return this.factureServiceForm?.get('comentarios') as FormControl;
  }

  get nrofacturaControl() {
    return this.factureServiceForm?.get('nro_factura') as FormControl;
  }

  get importeTotalControl() {
    return this.factureServiceForm?.get('importe_total') as FormControl;
  }

  get operacionControl() {
    return this.factureServiceForm?.get('operacion_comercial') as FormControl;
  }

  get estadoControl() {
    return this.factureServiceForm?.get('estado') as FormControl;
  }

  get comercialControl() {
    return this.factureServiceForm?.get('comercial') as FormControl;
  }

  get emisionControl() {
    return this.factureServiceForm?.get('fecha_emision') as FormControl;
  }

  get entregaControl() {
    return this.factureServiceForm?.get('fecha_entrega') as FormControl;
  }

  get servicioControl() {
    return this.factureServiceForm?.get('servicio') as FormControl;
  }

  sendData() {
    if (this.factureServiceForm.valid) {
      const factureService = this.factureServiceForm.value;
      const dateFormat = moment(factureService.fecha_emision);
      const dateFormat1 = moment(factureService.fecha_entrega);
      factureService.fecha_emision = dateFormat.format('yyyy-MM-DD');
      factureService.fecha_entrega = dateFormat1.format('yyyy-MM-DD');
      this.data.factureService ? this.edit.emit( factureService ) : this.create.emit( factureService );
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }
  

  onSubmit(data) {
    this.data.factureService ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
