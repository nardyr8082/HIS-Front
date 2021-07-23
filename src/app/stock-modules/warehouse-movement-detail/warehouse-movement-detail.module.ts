import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseMovementDetailRoutingModule } from './warehouse-movement-detail-routing.module';
import { WarehouseMovementDetailFormComponent } from './components/warehouse-movement-detail-form/warehouse-movement-detail-form.component';
import { WarehouseMovementDetailPageComponent } from './pages/warehouse-movement-detail-page/warehouse-movement-detail-page.component';


@NgModule({
  declarations: [WarehouseMovementDetailFormComponent, WarehouseMovementDetailPageComponent],
  imports: [
    CommonModule,
    WarehouseMovementDetailRoutingModule,
    SharedModule
  ],
  entryComponents: [WarehouseMovementDetailFormComponent],
})
export class WarehouseMovementDetailModule { }
