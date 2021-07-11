import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStatusRoutingModule } from './inventory-status-routing.module';
import { InventoryStatusPageComponent } from './pages/inventory-status-page/inventory-status-page.component';
import { InventoryStatusFormComponent } from './components/inventory-status-form/inventory-status-form.component';

@NgModule({
  declarations: [InventoryStatusPageComponent, InventoryStatusFormComponent],
  imports: [CommonModule, InventoryStatusRoutingModule, SharedModule],
  entryComponents: [InventoryStatusFormComponent],
})
export class InventoryStatusModule {}
