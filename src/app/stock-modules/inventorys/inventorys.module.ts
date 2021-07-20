import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventorysRoutingModule } from './inventorys-routing.module';
import { InventorysPageComponent } from './pages/inventorys-page/inventorys-page.component';
import { InventorysFormComponent } from './components/inventorys-form/inventorys-form.component';


@NgModule({
  declarations: [InventorysFormComponent, InventorysPageComponent],
  imports: [CommonModule, InventorysRoutingModule, SharedModule],
  entryComponents: [InventorysFormComponent],
})
export class InventorysModule {}
