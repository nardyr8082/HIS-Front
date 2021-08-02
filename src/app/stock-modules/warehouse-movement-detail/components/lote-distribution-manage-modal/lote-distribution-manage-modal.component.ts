import { Subscription } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BatchDistribution } from 'src/app/stock-modules/batch-distribution/models/batch-distribution.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WarehouseMovementDetail } from '../../models/warehouse-movement-detail.model';

@Component({
  selector: 'app-lote-distribution-manage-modal',
  templateUrl: './lote-distribution-manage-modal.component.html',
  styleUrls: ['./lote-distribution-manage-modal.component.scss'],
})
export class LoteDistributionManageModalComponent implements OnInit, OnDestroy {
  batchDistributions: BatchDistribution[] = [];
  moveDetail: WarehouseMovementDetail;

  subscription: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<LoteDistributionManageModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.moveDetail = this.data.moveDetail;
  }

  ngOnDestroy() {
    this.subscription.forEach((s) => s.unsubscribe());
  }
}
