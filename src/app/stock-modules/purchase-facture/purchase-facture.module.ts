import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseFacturePageComponent } from './pages/purchase-facture-page/purchase-facture-page.component';
import { PurchaseFactureRoutingModule } from './purchase-facture-routing.module';
import { PurchaseFactureFormComponent } from './components/purchase-facture-form/purchase-facture-form.component';

@NgModule({
  declarations: [PurchaseFactureFormComponent, PurchaseFacturePageComponent],
  imports: [CommonModule, PurchaseFactureRoutingModule, SharedModule],
  entryComponents: [PurchaseFactureFormComponent],
})
export class PurchaseFactureModule {}
