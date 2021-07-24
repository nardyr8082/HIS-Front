import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseReceivedTransferRoutingModule } from './warehouse-received-transfer-routing.module';
import { WarehouseReceivedTransferFormComponent } from './components/warehouse-received-transfer-form/warehouse-received-transfer-form.component';
import { WarehouseReceivedTransferPageComponent } from './pages/warehouse-received-transfer-page/warehouse-received-transfer-page.component';


@NgModule({
  declarations: [WarehouseReceivedTransferFormComponent, WarehouseReceivedTransferPageComponent],
  imports: [
    CommonModule,
    WarehouseReceivedTransferRoutingModule,
    SharedModule
  ],
  entryComponents: [WarehouseReceivedTransferFormComponent],
})
export class WarehouseReceivedTransferModule { }
