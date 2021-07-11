import { InventoryStateRoutingModule } from './invetory-state-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryStatePageComponent } from './pages/inventory-state-page/inventory-state-page.component';
import { InventoryStateFormComponent } from './components/inventory-state-form/inventory-state-form.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [InventoryStatePageComponent, InventoryStateFormComponent],
  imports: [CommonModule, SharedModule, InventoryStateRoutingModule],
  entryComponents: [InventoryStateFormComponent],
})
export class InvetoryStateModule {}
