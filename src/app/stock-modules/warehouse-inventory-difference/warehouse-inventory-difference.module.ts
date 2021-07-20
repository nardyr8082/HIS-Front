import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseInventoryDifferenceRoutingModule } from './warehouse-inventory-difference-routing.module';
import { WarehouseInventoryDifferenceFormComponent } from './components/warehouse-inventory-difference-form/warehouse-inventory-difference-form.component';
import { WarehouseInventoryDifferencePageComponent } from './pages/warehouse-inventory-difference-page/warehouse-inventory-difference-page.component';


@NgModule({
  declarations: [WarehouseInventoryDifferenceFormComponent, WarehouseInventoryDifferencePageComponent],
  imports: [
    CommonModule,
    WarehouseInventoryDifferenceRoutingModule,
    SharedModule
  ],
  entryComponents: [WarehouseInventoryDifferenceFormComponent],
})
export class WarehouseInventoryDifferenceModule { }
