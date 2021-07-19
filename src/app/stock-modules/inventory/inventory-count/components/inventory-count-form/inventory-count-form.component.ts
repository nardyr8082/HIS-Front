import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../../core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { InventoryCountService } from '../../services/inventory-count.service';
import { Indicator } from 'src/app/indicator-module/indicator/models/indicator.model';

@Component({
  selector: 'app-inventory-count-form',
  templateUrl: './inventory-count-form.component.html',
  styleUrls: ['./inventory-count-form.component.scss'],
})
export class InventoryCountFormComponent implements OnInit, OnDestroy {
  indicatores$: Observable<Indicator[]>;
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  inventoryCountForm: FormGroup;
  indicator: any = [];
  subscriptions: Subscription[] = [];

  constructor(public inventoryCountService: InventoryCountService, public dialogRef: MatDialogRef<InventoryCountFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getIndicator();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getIndicator() {
    const sub = this.inventoryCountService
      .getIndicator()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.indicator = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.inventoryCountForm = new FormGroup({
      conteo_cant_real: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.conteo_cant_real : '',[ Validators.required,  Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') ]),
      cantidad_maquina: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.cantidad_maquina : '', Validators.required),
      importe_maquina: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.importe_maquina : '', Validators.required),
      inventario: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.inventario_id : '', Validators.required),
      existencia: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.existencia_id : '', Validators.required),
    });
  }

  onSubmit(data) {
    this.data.inventoryCount ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
