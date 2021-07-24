import { WarehouseMovementDetailService } from './../../../warehouse-movement-detail/services/warehouse-movement-detail.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WarehouseMove } from './../../../warehouse-movement-detail/models/warehouse-move.model';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tranfer-recived-stock-form',
  templateUrl: './tranfer-recived-stock-form.component.html',
  styleUrls: ['./tranfer-recived-stock-form.component.scss'],
})
export class TranferRecivedStockFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  moves: WarehouseMove[];

  subscriptions: Subscription[] = [];

  tranferRecivedForm: FormGroup;

  constructor(
    private moveService: WarehouseMovementDetailService,
    public dialogRef: MatDialogRef<TranferRecivedStockFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getMoves();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.tranferRecivedForm = new FormGroup({
      id: new FormControl(this.data?.tranferRecived?.id ? this.data?.tranferRecived.id : null),
      movimiento: new FormControl(this.data?.tranferRecived?.movimiento ? this.data?.tranferRecived.movimiento.id : null, [Validators.required]),
      movimiento_origen: new FormControl(this.data?.tranferRecived?.movimiento_origen ? this.data?.tranferRecived.movimiento_origen.id : null, [
        Validators.required,
      ]),
    });
  }

  get idControl() {
    return this.tranferRecivedForm.get('id') as FormControl;
  }

  get movimientoControl() {
    return this.tranferRecivedForm.get('movimiento') as FormControl;
  }

  get movimiento_origenControl() {
    return this.tranferRecivedForm.get('movimiento_origen') as FormControl;
  }

  onSubmit(data) {
    this.data.tranferRecived ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  getMoves() {
    const sub = this.moveService
      .getMovement()
      .pipe(
        map((response) => {
          this.moves = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
