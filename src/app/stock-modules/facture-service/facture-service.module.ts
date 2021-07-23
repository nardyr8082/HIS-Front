import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactureServicePageComponent } from './page/fature-service-page/fature-service-page.component';
import { FactureServiceFormComponent } from './components/fature-service-form/fature-service-form.component';
import { FactureServiceRoutingModule } from './facture-service-routing.module';

@NgModule({
  declarations: [FactureServicePageComponent, FactureServiceFormComponent],
  imports: [CommonModule, FactureServiceRoutingModule, SharedModule],
  entryComponents: [FactureServiceFormComponent],
})
export class FactureServiceModule {}
