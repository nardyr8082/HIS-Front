import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasePageComponent } from './pages/purchase-page/purchase-page.component';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseFormComponent } from './components/purchase-form/purchase-form.component';

@NgModule({
  declarations: [PurchaseFormComponent, PurchasePageComponent],
  imports: [CommonModule, PurchaseRoutingModule, SharedModule],
  entryComponents: [PurchaseFormComponent],
})
export class PurchaseModule {}
