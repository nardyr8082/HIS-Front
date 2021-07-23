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

  subscriptions: Subscription[] = [];

  factureServiceForm: FormGroup;

  constructor(
    private factureService: FactureService,
    private stockService: ServicesstockService,
    public dialogRef: MatDialogRef<FactureServiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getServices();
    this.getFactures();
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

  getFactures() {
    const sub = this.factureService
      .getFacture({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.factures = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.factureServiceForm = new FormGroup({
      id: new FormControl(this.data?.factureService?.id ? this.data?.factureService.id : null),
      cantidad: new FormControl(this.data?.factureService?.cantidad ? this.data?.factureService.cantidad : null, [Validators.required]),
      servicio: new FormControl(this.data?.factureService?.servicio ? this.data?.factureService.servicio.id : null, [Validators.required]),
      factura: new FormControl(this.data?.factureService?.factura ? this.data?.factureService.factura.id : null, [Validators.required]),
    });
  }

  get idControl() {
    return this.factureServiceForm.get('id') as FormControl;
  }

  get cantidadControl() {
    return this.factureServiceForm.get('cantidad') as FormControl;
  }

  get servicioControl() {
    return this.factureServiceForm.get('servicio') as FormControl;
  }

  get facturaControl() {
    return this.factureServiceForm.get('factura') as FormControl;
  }

  onSubmit(data) {
    this.data.factureService ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
