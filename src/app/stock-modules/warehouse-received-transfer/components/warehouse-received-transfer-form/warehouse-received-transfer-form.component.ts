import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { WarehouseReceivedTransferService } from '../../services/warehouse-received-transfer.service';

@Component({
  selector: 'app-warehouse-received-transfer-form',
  templateUrl: './warehouse-received-transfer-form.component.html',
  styleUrls: ['./warehouse-received-transfer-form.component.scss']
})
export class WarehouseReceivedTransferFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  warehouseReceivedTransfer: any = [];
  move: any = [];
  WarehouseReceivedTransferForm: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    public warehouseReceivedTransferService: WarehouseReceivedTransferService,
    public dialogRef: MatDialogRef<WarehouseReceivedTransferFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.buildForm();
    this.getWarehouseMove();

  }
  ngOnDestroy() {
    this.subscriptions;
  }
  getWarehouseMove() {
    const sub = this.warehouseReceivedTransferService
      .getMovement()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.move = response.results;
        }),
      )
      .subscribe();


    this.subscriptions.push(sub);
  }

  buildForm() {
    this.WarehouseReceivedTransferForm = new FormGroup({
      movimiento: new FormControl(this.data.warehouseReceivedTransfer ? this.data.warehouseReceivedTransfer.movimiento : '', Validators.required),
      movimiento_origen: new FormControl(this.data.warehouseReceivedTransfer ? this.data.warehouseReceivedTransfer.movimiento_origen : '', Validators.required),
    });
  }

  get movimientoControl() {
    return this.WarehouseReceivedTransferForm?.get('movimiento') as FormControl;
  }
  get movimiento_origenControl() {
    return this.WarehouseReceivedTransferForm?.get('movimiento_origen') as FormControl;
  }

  onSubmit(data) {
    console.log(data)
    if (data.movimiento != data.movimiento_origen) {
       this.edit.emit(data);
      this.dialogRef.close();
    }

  }

  onCancel() {
    this.dialogRef.close();
  }

}
