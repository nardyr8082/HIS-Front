import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { StockFormComponent } from './components/stock-form/stock-form.component';
import { StockRoutingModule } from './stock-routing.module';



@NgModule({
  declarations: [StockPageComponent, StockFormComponent],
  imports: [CommonModule, StockRoutingModule, SharedModule],
  entryComponents: [StockFormComponent],
})
export class StockModule {}
