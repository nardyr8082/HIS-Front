import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturePageComponent } from './pages/facture-page/facture-page.component';
import { FactureRoutingModule } from './facture-routing.module';
import { FactureFormComponent } from './components/facture-form/facture-form.component';

@NgModule({
  declarations: [FactureFormComponent, FacturePageComponent],
  imports: [CommonModule, FactureRoutingModule, SharedModule],
  entryComponents: [FactureFormComponent],
})
export class FactureModule {}
