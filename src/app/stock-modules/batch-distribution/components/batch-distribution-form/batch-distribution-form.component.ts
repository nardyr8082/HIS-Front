import { WarehouseLotService } from './../../../warehouse-lot/services/warehouse-lot.service';
import { warehouseLot } from './../../../warehouse-lot/models/warehouseLot';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-batch-distribution-form',
  templateUrl: './batch-distribution-form.component.html',
  styleUrls: ['./batch-distribution-form.component.scss'],
})
export class BatchDistributionFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  lotes: warehouseLot[];

  subscriptions: Subscription[] = [];

  batchDistributionForm: FormGroup;

  constructor(
    private loteService: WarehouseLotService,
    public dialogRef: MatDialogRef<BatchDistributionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getLotes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.batchDistributionForm = new FormGroup({
      id: new FormControl(this.data?.Almacencaja?.id ? this.data?.batchDistribution.id : null),
      cant_por_lote: new FormControl(this.data?.batchDistribution?.cant_por_lote ? this.data?.batchDistribution.cant_por_lote : null, [Validators.required]),
      lote: new FormControl(this.data?.batchDistribution?.lote ? this.data?.batchDistribution.lote.id : null, [Validators.required]),
      detalle_movimiento: new FormControl(this.data?.batchDistribution?.detalle_movimiento ? this.data?.batchDistribution.detalle_movimiento.id : 1, [
        Validators.required,
      ]),
    });
  }

  get idControl() {
    return this.batchDistributionForm.get('id') as FormControl;
  }

  get cant_por_loteControl() {
    return this.batchDistributionForm.get('cant_por_lote') as FormControl;
  }

  get loteControl() {
    return this.batchDistributionForm.get('lote') as FormControl;
  }

  get detalle_movimientoControl() {
    return this.batchDistributionForm.get('detalle_movimiento') as FormControl;
  }

  onSubmit(data) {
    this.data.batchDistribution ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  getLotes() {
    const sub = this.loteService
      .getWarehouseLot({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.lotes = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
