import { TranferRecivedStockRoutingModule } from './transfer-recived-stock-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranferRecivedStockPageComponent } from './pages/tranfer-recived-stock-page/tranfer-recived-stock-page.component';
import { TranferRecivedStockFormComponent } from './components/tranfer-recived-stock-form/tranfer-recived-stock-form.component';

@NgModule({
  declarations: [TranferRecivedStockPageComponent, TranferRecivedStockFormComponent],
  imports: [CommonModule, TranferRecivedStockRoutingModule, SharedModule],
  entryComponents: [TranferRecivedStockFormComponent],
})
export class TransferRecivedStockModule {}
