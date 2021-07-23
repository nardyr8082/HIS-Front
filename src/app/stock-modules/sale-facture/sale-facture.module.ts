import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleFacturePageComponent } from './pages/sale-facture-page/sale-facture-page.component';
import { SaleFactureRoutingModule } from './sale-facture-routing.module';
import { SaleFactureFormComponent } from './components/sale-facture-form/sale-facture-form.component';

@NgModule({
  declarations: [SaleFactureFormComponent, SaleFacturePageComponent],
  imports: [CommonModule, SaleFactureRoutingModule, SharedModule],
  entryComponents: [SaleFactureFormComponent],
})
export class SaleFactureModule {}
