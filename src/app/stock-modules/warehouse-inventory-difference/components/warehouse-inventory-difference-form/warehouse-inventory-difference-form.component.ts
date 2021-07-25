import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { WarehouseInventoryDifferenceService } from './../../services/warehouse-inventory-difference.service';
import { InventoryCountService } from '../../../inventory/inventory-count/services/inventory-count.service';
import { InventoryCount } from '../../../inventory/inventory-count/models/inventory-count.model';

@Component({
  selector: 'app-warehouse-inventory-difference-form',
  templateUrl: './warehouse-inventory-difference-form.component.html',
  styleUrls: ['./warehouse-inventory-difference-form.component.scss']
})
export class WarehouseInventoryDifferenceFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  conteo: any = [];
  warehouseInventoryDifferenceForm: FormGroup;


  subscriptions: Subscription[] = [];

  constructor(
    private warehouseInventoryDifferenceService: WarehouseInventoryDifferenceService,
    private inventoryCountService: InventoryCountService,
    public dialogRef: MatDialogRef<WarehouseInventoryDifferenceFormComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getCount();
  }

  ngOnDestroy() {
    this.subscriptions;

  }

  buildForm() {
    this.warehouseInventoryDifferenceForm = new FormGroup({
      dif_cantidad: new FormControl(this.data.warehouseInventoryDifference ? this.data.warehouseInventoryDifference.dif_cantidad : '', Validators.required),
      dif_importe: new FormControl(this.data.warehouseInventoryDifference ? this.data.warehouseInventoryDifference.dif_importe : '', Validators.required),
      conteo: new FormControl(this.data.warehouseInventoryDifference ? this.data.warehouseInventoryDifference.conteo : '', Validators.required),
    });
  }

  getCount() {
    const sub = this.inventoryCountService
      .getInventoryCount({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.conteo = response.results;
          console.log(this.conteo);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  get dif_cantidadControl() {
    return this.warehouseInventoryDifferenceForm?.get('dif_cantidad') as FormControl;
  }
  get dif_importeControl() {
    return this.warehouseInventoryDifferenceForm?.get('dif_importe') as FormControl;
  }
  get conteoControl() {
    return this.warehouseInventoryDifferenceForm?.get('conteo') as FormControl;
  }

  onSubmit(data) {
    console.log(data)
    this.data.conteo ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }


}
