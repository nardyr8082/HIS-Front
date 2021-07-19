import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryCountPageComponent } from './pages/inventory-count-page/inventory-count-page.component';
import { InventoryCountRoutingModule } from './inventory-count-routing.module';
import { InventoryCountFormComponent } from './components/inventory-count-form/inventory-count-form.component';

@NgModule({
  declarations: [InventoryCountFormComponent, InventoryCountPageComponent],
  imports: [CommonModule, InventoryCountRoutingModule, SharedModule],
  entryComponents: [InventoryCountFormComponent],
})
export class InventoryCountModule {}
