import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricechangesFormComponent } from './components/pricechanges-form/pricechanges-form.component';
import { PricechangesRoutingModule } from './pricechanges-routing.module';
import { PricechangesPageComponent } from './pages/pricechanges-page/pricechanges-page.component';



@NgModule({
  declarations: [PricechangesFormComponent, PricechangesPageComponent],
  imports: [CommonModule, PricechangesRoutingModule, SharedModule],
  entryComponents: [PricechangesFormComponent],
})
export class PricechangesModule {}
