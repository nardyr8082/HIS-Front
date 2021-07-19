import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../../core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { InventoryCountService } from '../../services/inventory-count.service';

@Component({
  selector: 'app-inventory-count-form',
  templateUrl: './inventory-count-form.component.html',
  styleUrls: ['./inventory-count-form.component.scss'],
})
export class InventoryCountFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  inventoryCountForm: FormGroup;
  existencia: any = [];
  inventario: any = [];
  subscriptions: Subscription[] = [];

  constructor(public inventoryCountService: InventoryCountService, public dialogRef: MatDialogRef<InventoryCountFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getExistencia();
    this.getInventario();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getExistencia() {
    const sub = this.inventoryCountService
      .getExistencia()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.existencia = response.results;
          console.log(this.existencia);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getInventario() {
    const sub = this.inventoryCountService
      .getInventario()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.inventario = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.inventoryCountForm = new FormGroup({
      conteo_cant_real: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.conteo_cant_real : ''),
      cantidad_maquina: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.cantidad_maquina : '', Validators.required),
      importe_maquina: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.importe_maquina : '', Validators.required),
      inventario: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.inventario_id : '', Validators.required),
      existencia: new FormControl(this.data.inventoryCount ? this.data.inventoryCount.existencia_id : '', Validators.required),
    });
  }

  get cantMaquinaControl() {
    return this.inventoryCountForm?.get('cantidad_maquina') as FormControl;
  }

  get importMaquinaControl() {
    return this.inventoryCountForm?.get('importe_maquina') as FormControl;
  }

  get inventarioControl() {
    return this.inventoryCountForm?.get('inventario') as FormControl;
  }

  get existenciaControl() {
    return this.inventoryCountForm?.get('existencia') as FormControl;
  }

  onSubmit(data) {
    this.data.inventoryCount ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
